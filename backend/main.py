import os
import sys
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

# Ensure both project root and backend folder are in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, '..'))

for p in [PROJECT_ROOT, CURRENT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, EmailStr
import uvicorn

try:
    from .database import SessionLocal, engine
    from . import models as db_models
    from .recommendations import get_recommendations
    from .chatbot import get_skincare_advice, get_skincare_advice_stream
    from .auth import (
        hash_password,
        verify_password,
        create_access_token,
        get_current_user,
        get_optional_current_user,
        security,
        get_db
    )
    from .gradcam import generate_gradcam
    from .scanner import extract_ingredients_from_image, analyze_ingredients
except ImportError:
    from database import SessionLocal, engine
    import models as db_models
    from recommendations import get_recommendations
    from chatbot import get_skincare_advice, get_skincare_advice_stream
    from auth import (
        hash_password,
        verify_password,
        create_access_token,
        get_current_user,
        get_optional_current_user,
        security,
        get_db
    )
    from gradcam import generate_gradcam
    from scanner import extract_ingredients_from_image, analyze_ingredients

from ml_model.predict import predict_skin, model as ml_model, device, CLASSES

# ==========================================
# DATABASE INITIALIZATION
# ==========================================
try:
    db_models.Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
except Exception as e:
    print(f"Database initialization notice: {e}")

# ==========================================
# FASTAPI APPLICATION
# ==========================================
app = FastAPI(
    title="Clinical AI Skin Analysis & Dermatology API",
    description="Deep learning skin diagnostics, weekly tracking, Grad-CAM heatmaps, OCR product scanner, and AI assistant.",
    version="3.0.0"
)

# ==========================================
# CORS CONFIGURATION
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://skin-ai-analysis.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# SCHEMAS
# ==========================================
class UserRegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2)
    password: str = Field(..., min_length=6)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[str] = None
    analysis_id: Optional[int] = None
    skin_context: Optional[Dict[str, Any]] = None
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    session_id: str
    history: List[ChatMessage]

class AnalysisResponse(BaseModel):
    analysis_id: int
    prediction: Dict[str, Any]
    recommendations: Dict[str, Any]
    heatmap_image: Optional[str] = None

# ==========================================
# HEALTH ENDPOINT
# ==========================================
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Skin Diagnostics & Dermatology API",
        "version": "3.0.0",
        "device": str(device),
        "database": "connected"
    }

# ==========================================
# AUTHENTICATION ENDPOINTS (FEATURE 1)
# ==========================================
@app.post("/auth/register", response_model=AuthResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(db_models.User).filter(db_models.User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password & create user
    hashed = hash_password(req.password)
    new_user = db_models.User(
        email=req.email.lower().strip(),
        full_name=req.full_name.strip(),
        hashed_password=hashed,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create JWT token
    token = create_access_token({"sub": new_user.email, "user_id": new_user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "is_active": new_user.is_active
        }
    }


@app.post("/auth/login", response_model=AuthResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(db_models.User).filter(db_models.User.email == req.email.lower().strip()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated."
        )

    token = create_access_token({"sub": user.email, "user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active
        }
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: db_models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active
    }


@app.post("/auth/logout")
def logout_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if credentials and credentials.credentials:
        token = credentials.credentials
        # Check if already blacklisted
        existing = db.query(db_models.TokenBlacklist).filter(db_models.TokenBlacklist.token == token).first()
        if not existing:
            db.add(db_models.TokenBlacklist(token=token))
            db.commit()

    return {"message": "Logged out successfully."}


# ==========================================
# ANALYZE SKIN + GRAD-CAM (FEATURE 3)
# ==========================================
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_skin(
    file: UploadFile = File(...),
    current_user: Optional[db_models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    # Validate MIME type
    valid_mime_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type and file.content_type.lower() not in valid_mime_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Please upload a JPEG, PNG, or WEBP image."
        )

    # Read binary payload
    image_bytes = await file.read()

    # Validate image size (max 10MB)
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image exceeds 10MB limit. Please upload a smaller photo."
        )

    if len(image_bytes) < 1000:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty or corrupted."
        )

    try:
        # Run ML model prediction & MediaPipe face crop
        prediction = predict_skin(image_bytes)

        # Generate evidence-based recommendations
        recommendations = get_recommendations(prediction["scores"])

        # Determine target class index for Grad-CAM
        primary_cond = prediction["primary_condition"]
        class_idx = 0
        if primary_cond in CLASSES:
            class_idx = CLASSES.index(primary_cond)
        elif primary_cond == "oily_skin" and "oily" in CLASSES:
            class_idx = CLASSES.index("oily")
        elif primary_cond == "dry_skin" and "dry" in CLASSES:
            class_idx = CLASSES.index("dry")

        # Generate Grad-CAM Heatmap overlay
        heatmap_b64 = ""
        if ml_model is not None:
            heatmap_b64 = generate_gradcam(image_bytes, ml_model, class_idx, str(device))

        # Persist to database
        analysis_record = db_models.SkinAnalysis(
            user_id=current_user.id if current_user else None,
            primary_condition=prediction["primary_condition"],
            severity=prediction["severity"],
            skin_type=prediction.get("skin_type", "Normal/Combination"),
            confidence=prediction.get("confidence", 0.0),
            scores=prediction["scores"],
            recommendations=recommendations,
            heatmap_b64=heatmap_b64
        )
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)

        return {
            "analysis_id": analysis_record.id,
            "prediction": prediction,
            "recommendations": recommendations,
            "heatmap_image": heatmap_b64
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Skin analysis failed: {str(e)}"
        )


# ==========================================
# WEEKLY PROGRESS TRACKING (FEATURE 2)
# ==========================================
def calculate_skin_health_score(scores: dict) -> float:
    """
    Skin Health Score formula:
    score = 100 - (acne*0.30 + oily*0.20 + dry*0.15 + pores*0.15 + pigment*0.20)
    """
    acne = scores.get("acne", 0.0)
    oily = scores.get("oily_skin", 0.0)
    dry = scores.get("dry_skin", 0.0)
    pores = scores.get("open_pores", 0.0)
    pigment = scores.get("pigmentation", 0.0)

    score = 100.0 - (
        acne * 0.30 +
        oily * 0.20 +
        dry * 0.15 +
        pores * 0.15 +
        pigment * 0.20
    )
    return round(max(0.0, min(100.0, score)), 1)


@app.post("/checkin")
async def weekly_checkin(
    file: UploadFile = File(...),
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024 or len(image_bytes) < 1000:
        raise HTTPException(status_code=400, detail="Invalid image file size")

    # Run prediction
    prediction = predict_skin(image_bytes)
    recommendations = get_recommendations(prediction["scores"])

    # Calculate Skin Health Score
    health_score = calculate_skin_health_score(prediction["scores"])

    now = datetime.now()
    year, week_num, _ = now.isocalendar()

    # Get previous checkin to calculate improvement
    prev_checkin = db.query(db_models.WeeklyCheckin)\
        .filter(db_models.WeeklyCheckin.user_id == current_user.id)\
        .order_by(db_models.WeeklyCheckin.created_at.desc())\
        .first()

    improvement = 0.0
    if prev_checkin:
        improvement = round(health_score - prev_checkin.skin_health_score, 1)

    # Save checkin record
    checkin_record = db_models.WeeklyCheckin(
        user_id=current_user.id,
        week_number=week_num,
        year=year,
        scores=prediction["scores"],
        primary_condition=prediction["primary_condition"],
        severity=prediction["severity"],
        skin_health_score=health_score,
        image_path=None
    )
    db.add(checkin_record)
    db.commit()
    db.refresh(checkin_record)

    return {
        "checkin_id": checkin_record.id,
        "week_number": week_num,
        "year": year,
        "skin_health_score": health_score,
        "improvement_vs_last_week": improvement,
        "prediction": prediction,
        "recommendations": recommendations
    }


@app.get("/progress")
def get_user_progress(
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch last 12 checkins sorted chronologically
    checkins = db.query(db_models.WeeklyCheckin)\
        .filter(db_models.WeeklyCheckin.user_id == current_user.id)\
        .order_by(db_models.WeeklyCheckin.created_at.asc())\
        .limit(12)\
        .all()

    if not checkins:
        return {
            "checkins": [],
            "total_improvement": 0.0,
            "current_score": 0.0,
            "weeks_tracked": 0,
            "best_condition": "Start your first scan"
        }

    formatted = []
    for idx, c in enumerate(checkins):
        formatted.append({
            "id": c.id,
            "week_label": f"Week {c.week_number}",
            "week_number": c.week_number,
            "year": c.year,
            "skin_health_score": c.skin_health_score,
            "scores": c.scores,
            "primary_condition": c.primary_condition,
            "severity": c.severity,
            "date": c.created_at.isoformat() if c.created_at else None
        })

    first_score = checkins[0].skin_health_score
    latest_score = checkins[-1].skin_health_score
    total_improvement = round(latest_score - first_score, 1)

    # Determine best condition trend
    primary = checkins[-1].primary_condition.replace('_', ' ').title()
    best_cond = f"{primary} improving" if total_improvement >= 0 else f"Targeting {primary}"

    return {
        "checkins": formatted,
        "total_improvement": total_improvement,
        "current_score": latest_score,
        "weeks_tracked": len(checkins),
        "best_condition": best_cond
    }


@app.get("/progress/compare")
def compare_progress(
    week1: int = Query(...),
    week2: int = Query(...),
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c1 = db.query(db_models.WeeklyCheckin)\
        .filter(db_models.WeeklyCheckin.user_id == current_user.id, db_models.WeeklyCheckin.week_number == week1)\
        .order_by(db_models.WeeklyCheckin.created_at.asc())\
        .first()

    c2 = db.query(db_models.WeeklyCheckin)\
        .filter(db_models.WeeklyCheckin.user_id == current_user.id, db_models.WeeklyCheckin.week_number == week2)\
        .order_by(db_models.WeeklyCheckin.created_at.desc())\
        .first()

    return {
        "week1": {
            "week_number": week1,
            "skin_health_score": c1.skin_health_score if c1 else None,
            "scores": c1.scores if c1 else {},
            "primary_condition": c1.primary_condition if c1 else None,
            "severity": c1.severity if c1 else None,
            "date": c1.created_at.isoformat() if c1 and c1.created_at else None
        },
        "week2": {
            "week_number": week2,
            "skin_health_score": c2.skin_health_score if c2 else None,
            "scores": c2.scores if c2 else {},
            "primary_condition": c2.primary_condition if c2 else None,
            "severity": c2.severity if c2 else None,
            "date": c2.created_at.isoformat() if c2 and c2.created_at else None
        }
    }


# ==========================================
# PRODUCT SCANNER OCR (FEATURE 4)
# ==========================================
@app.post("/scan-product")
async def scan_product(
    file: UploadFile = File(...),
    analysis_id: Optional[int] = Form(None),
    current_user: Optional[db_models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    if len(image_bytes) < 500:
        raise HTTPException(status_code=400, detail="Invalid or empty product label photo")

    # Extract ingredients using OCR
    extracted_ingredients = extract_ingredients_from_image(image_bytes)

    # Fetch user skin conditions
    user_skin_conditions = {"acne": 20, "oily_skin": 20, "dry_skin": 20, "open_pores": 20, "pigmentation": 20}
    
    if analysis_id:
        record = db.query(db_models.SkinAnalysis).filter(db_models.SkinAnalysis.id == analysis_id).first()
        if record and record.scores:
            user_skin_conditions = record.scores
    elif current_user:
        latest = db.query(db_models.SkinAnalysis)\
            .filter(db_models.SkinAnalysis.user_id == current_user.id)\
            .order_by(db_models.SkinAnalysis.created_at.desc())\
            .first()
        if latest and latest.scores:
            user_skin_conditions = latest.scores

    # Analyze ingredients against skin profile
    analysis_result = analyze_ingredients(extracted_ingredients, user_skin_conditions)

    return {
        "extracted_ingredients": extracted_ingredients,
        "analysis": analysis_result,
        "user_conditions_used": user_skin_conditions
    }


# ==========================================
# CHAT ENDPOINTS
# ==========================================
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    req: ChatRequest,
    current_user: Optional[db_models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    session_id = req.session_id or str(uuid.uuid4())
    history_dicts = [{"role": m.role, "content": m.content} for m in req.history]

    try:
        response_text = await get_skincare_advice(
            message=req.message,
            skin_context=req.skin_context,
            history=history_dicts
        )

        updated_history = req.history + [
            ChatMessage(role="user", content=req.message),
            ChatMessage(role="assistant", content=response_text)
        ]

        # Save to database
        try:
            db.add(db_models.ChatHistory(
                user_id=current_user.id if current_user else None,
                analysis_id=req.analysis_id,
                session_id=session_id,
                role="user",
                content=req.message
            ))
            db.add(db_models.ChatHistory(
                user_id=current_user.id if current_user else None,
                analysis_id=req.analysis_id,
                session_id=session_id,
                role="assistant",
                content=response_text
            ))
            db.commit()
        except Exception as db_err:
            print(f"Chat DB logging error: {db_err}")

        return {
            "response": response_text,
            "session_id": session_id,
            "history": updated_history
        }

    except Exception as e:
        print(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.post("/chat/stream")
async def chat_stream_endpoint(
    req: ChatRequest,
    current_user: Optional[db_models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    session_id = req.session_id or str(uuid.uuid4())
    history_dicts = [{"role": m.role, "content": m.content} for m in req.history]

    async def event_generator():
        collected_response = []
        try:
            async for token in get_skincare_advice_stream(
                message=req.message,
                skin_context=req.skin_context,
                history=history_dicts
            ):
                collected_response.append(token)
                yield token

            full_text = "".join(collected_response)
            try:
                db.add(db_models.ChatHistory(
                    user_id=current_user.id if current_user else None,
                    analysis_id=req.analysis_id,
                    session_id=session_id,
                    role="user",
                    content=req.message
                ))
                db.add(db_models.ChatHistory(
                    user_id=current_user.id if current_user else None,
                    analysis_id=req.analysis_id,
                    session_id=session_id,
                    role="assistant",
                    content=full_text
                ))
                db.commit()
            except Exception as db_err:
                print(f"Stream DB save warning: {db_err}")

        except Exception as e:
            yield f"\n[Error: {str(e)}]"

    return StreamingResponse(event_generator(), media_type="text/plain")


# ==========================================
# HISTORY ENDPOINTS (PROTECTED & USER FILTERED)
# ==========================================
@app.get("/history")
def get_analysis_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: Optional[db_models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(db_models.SkinAnalysis)
    if current_user:
        query = query.filter(db_models.SkinAnalysis.user_id == current_user.id)

    analyses = query.order_by(db_models.SkinAnalysis.created_at.desc())\
        .offset(skip).limit(limit).all()
    
    return [
        {
            "id": a.id,
            "user_id": a.user_id,
            "primary_condition": a.primary_condition,
            "severity": a.severity,
            "skin_type": a.skin_type or "Normal",
            "confidence": a.confidence or 0.0,
            "scores": a.scores,
            "recommendations": a.recommendations,
            "heatmap_image": a.heatmap_b64,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }
        for a in analyses
    ]


@app.get("/history/{analysis_id}")
def get_single_analysis(
    analysis_id: int,
    current_user: Optional[db_models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(db_models.SkinAnalysis).filter(db_models.SkinAnalysis.id == analysis_id)
    if current_user:
        query = query.filter(db_models.SkinAnalysis.user_id == current_user.id)

    analysis = query.first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    
    return {
        "id": analysis.id,
        "user_id": analysis.user_id,
        "primary_condition": analysis.primary_condition,
        "severity": analysis.severity,
        "skin_type": analysis.skin_type,
        "confidence": analysis.confidence,
        "scores": analysis.scores,
        "recommendations": analysis.recommendations,
        "heatmap_image": analysis.heatmap_b64,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None
    }


@app.delete("/history/{analysis_id}")
def delete_single_analysis(
    analysis_id: int,
    current_user: Optional[db_models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(db_models.SkinAnalysis).filter(db_models.SkinAnalysis.id == analysis_id)
    if current_user:
        query = query.filter(db_models.SkinAnalysis.user_id == current_user.id)

    analysis = query.first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    
    db.delete(analysis)
    db.commit()
    return {"message": "Record deleted successfully", "id": analysis_id}


# ==========================================
# SERVER RUNNER
# ==========================================
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)