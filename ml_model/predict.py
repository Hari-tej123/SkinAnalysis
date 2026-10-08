import os
import sys
import cv2
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import mediapipe as mp

# Support imports whether executed from root or backend directory
try:
    from ml_model.model import load_model, CLASSES
except ImportError:
    try:
        from model import load_model, CLASSES
    except ImportError:
        sys.path.append(os.path.dirname(__file__))
        from model import load_model, CLASSES

# =========================
# DEVICE CONFIGURATION
# =========================
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "best_skin_model.pth"
)

# Load model instance safely
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = load_model(MODEL_PATH, device)
        print("ML model loaded successfully.")
    except Exception as e:
        print(f"Warning: Could not load model from {MODEL_PATH}: {e}")

# =========================
# PREPROCESSING (TorchVision)
# =========================
PREPROCESS = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# MediaPipe face detection
mp_face = mp.solutions.face_detection

def detect_and_crop_face(image_bytes: bytes) -> tuple[np.ndarray, bool]:
    """
    Detect face using MediaPipe.
    Returns (cropped_rgb_face, face_detected_bool).
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid or corrupted image file")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w = img_rgb.shape[:2]

    try:
        with mp_face.FaceDetection(min_detection_confidence=0.4) as detector:
            results = detector.process(img_rgb)

            if results.detections and len(results.detections) > 0:
                detection = results.detections[0]
                bbox = detection.location_data.relative_bounding_box

                # Add comfortable margin around the face
                margin_x = int(bbox.width * w * 0.15)
                margin_y = int(bbox.height * h * 0.15)

                x1 = max(0, int(bbox.xmin * w) - margin_x)
                y1 = max(0, int(bbox.ymin * h) - margin_y)
                x2 = min(w, int((bbox.xmin + bbox.width) * w) + margin_x)
                y2 = min(h, int((bbox.ymin + bbox.height) * h) + margin_y)

                # Ensure crop has valid dimensions
                if (x2 - x1) > 20 and (y2 - y1) > 20:
                    face_crop = img_rgb[y1:y2, x1:x2]
                    return face_crop, True
    except Exception as e:
        print(f"Face detection notice: {e}")

    # Fallback to full image
    return img_rgb, False


def determine_skin_type(scores: dict) -> str:
    """Determine clinical skin type from condition score breakdown."""
    oily = scores.get("oily_skin", 0)
    dry = scores.get("dry_skin", 0)
    acne = scores.get("acne", 0)
    normal = scores.get("normal", 0)

    if oily >= 35 and dry >= 30:
        return "Combination Skin"
    elif oily >= 45:
        return "Oily Skin"
    elif dry >= 45:
        return "Dry / Dehydrated Skin"
    elif acne >= 55:
        return "Acne-Prone / Sensitive Skin"
    elif normal >= 45:
        return "Normal / Balanced Skin"
    elif oily > dry:
        return "Combination / Oily-Leaning"
    else:
        return "Normal to Combination"


def predict_skin(image_bytes: bytes) -> dict:
    """
    Full skin analysis pipeline.
    Predicts across 6 conditions:
    acne, oily_skin, dry_skin, open_pores, pigmentation, normal.
    """
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = load_model(MODEL_PATH, device)
        else:
            raise RuntimeError("Model checkpoint not found. Please ensure best_skin_model.pth is present.")

    # 1. Face detection & crop
    face_img, face_found = detect_and_crop_face(image_bytes)

    # 2. Image transformation with PIL + torchvision
    pil_img = Image.fromarray(face_img)
    tensor = PREPROCESS(pil_img).unsqueeze(0).to(device)

    # 3. Model Inference
    with torch.no_grad():
        logits = model(tensor)
        raw_probs = F.softmax(logits, dim=1).squeeze().cpu().numpy()

    # Raw classes mapping: ['acne', 'oily', 'dry', 'pigmentation', 'normal']
    base_scores = {}
    for i, cls in enumerate(CLASSES):
        base_scores[cls] = float(raw_probs[i]) * 100.0

    # 4. Generate comprehensive 6-condition score distribution
    acne_score = base_scores.get('acne', 0.0)
    oily_raw = base_scores.get('oily', 0.0)
    dry_raw = base_scores.get('dry', 0.0)
    pigmentation_score = base_scores.get('pigmentation', 0.0)
    normal_score = base_scores.get('normal', 0.0)

    # Derive open_pores from sebum/oily concentration and texture markers
    open_pores_score = min(92.0, max(5.0, (oily_raw * 0.75) + (acne_score * 0.2)))

    scores = {
        "acne": round(acne_score, 1),
        "oily_skin": round(oily_raw, 1),
        "dry_skin": round(dry_raw, 1),
        "open_pores": round(open_pores_score, 1),
        "pigmentation": round(pigmentation_score, 1),
        "normal": round(normal_score, 1)
    }

    # Primary condition (ignoring normal unless normal is dominant)
    problem_scores = {k: v for k, v in scores.items() if k != "normal"}
    top_problem = max(problem_scores, key=problem_scores.get)
    
    if scores["normal"] > 65 and problem_scores[top_problem] < 30:
        primary_condition = "normal"
        top_score = scores["normal"]
    else:
        primary_condition = top_problem
        top_score = problem_scores[top_problem]

    # Severity estimation
    if top_score >= 65:
        severity = "severe"
    elif top_score >= 35:
        severity = "moderate"
    else:
        severity = "mild"

    skin_type = determine_skin_type(scores)

    return {
        "scores": scores,
        "primary_condition": primary_condition,
        "severity": severity,
        "skin_type": skin_type,
        "confidence": round(top_score, 1),
        "face_detected": face_found
    }