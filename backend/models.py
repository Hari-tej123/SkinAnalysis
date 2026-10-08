from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

try:
    from .database import Base
except ImportError:
    from database import Base

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(255), unique=True, index=True, nullable=False)
    full_name       = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active       = Column(Boolean, default=True, nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    analyses        = relationship("SkinAnalysis", back_populates="user", cascade="all, delete-orphan")
    chat_messages   = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    checkins        = relationship("WeeklyCheckin", back_populates="user", cascade="all, delete-orphan")


class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    id              = Column(Integer, primary_key=True, index=True)
    token           = Column(String(500), unique=True, index=True, nullable=False)
    blacklisted_at  = Column(DateTime(timezone=True), server_default=func.now())


class SkinAnalysis(Base):
    __tablename__ = "skin_analyses"

    id                = Column(Integer, primary_key=True, index=True)
    user_id           = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    primary_condition = Column(String(50), nullable=False)
    severity          = Column(String(20), nullable=False)
    skin_type         = Column(String(50), nullable=True)
    confidence        = Column(Float, nullable=True)
    scores            = Column(JSON, nullable=False)          # { "acne": 82.5, ... }
    recommendations   = Column(JSON, nullable=False)          # full recommendations dict
    heatmap_b64       = Column(Text, nullable=True)          # base64 Grad-CAM heatmap
    created_at        = Column(DateTime(timezone=True), server_default=func.now())

    user              = relationship("User", back_populates="analyses")


class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    analysis_id = Column(Integer, nullable=True)
    session_id  = Column(String(100), index=True, nullable=True)
    role        = Column(String(20), nullable=False)    # "user" or "assistant"
    content     = Column(Text, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    user        = relationship("User", back_populates="chat_messages")


class WeeklyCheckin(Base):
    __tablename__ = "weekly_checkins"

    id                = Column(Integer, primary_key=True, index=True)
    user_id           = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    week_number       = Column(Integer, nullable=False)
    year              = Column(Integer, nullable=False)
    scores            = Column(JSON, nullable=False)          # { "acne": 20, ... }
    primary_condition = Column(String(50), nullable=False)
    severity          = Column(String(20), nullable=False)
    skin_health_score = Column(Float, nullable=False)         # 0 - 100
    image_path        = Column(String(500), nullable=True)
    created_at        = Column(DateTime(timezone=True), server_default=func.now())

    user              = relationship("User", back_populates="checkins")