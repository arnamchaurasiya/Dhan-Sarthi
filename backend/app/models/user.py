"""
Dhan Sarthi — User, InvestorProfile, KYCRecord Models
TDD Section 12.2 — Identity & Compliance entities
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=_uuid)
    email = Column(String, unique=True, nullable=True, index=True)
    phone = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    profiles = relationship("InvestorProfile", back_populates="user", cascade="all, delete-orphan")
    kyc_records = relationship("KYCRecord", back_populates="user", cascade="all, delete-orphan")
    consents = relationship("Consent", back_populates="user", cascade="all, delete-orphan")
    risk_profiles = relationship("RiskProfile", back_populates="user", cascade="all, delete-orphan")
    safety_alerts = relationship("SafetyAlert", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    learning_progress = relationship("LearningProgress", back_populates="user", cascade="all, delete-orphan")


class InvestorProfile(Base):
    __tablename__ = "investor_profiles"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    # Risk classification: Conservative / Moderate / Aggressive
    risk_profile = Column(String, nullable=False, default="Conservative")
    # Horizon: "< 1 year" / "1–3 years" / "3–5 years" / "5–10 years" / "10+ years"
    investment_horizon = Column(String, nullable=False, default="3–5 years")
    # Goal: Wealth Creation / Regular Income / Capital Preservation / Retirement / Child Education
    primary_goal = Column(String, nullable=False, default="Wealth Creation")
    # Liquidity need: High / Medium / Low
    liquidity_need = Column(String, nullable=False, default="Medium")
    target_amount = Column(Float, nullable=True)
    target_timeframe_years = Column(Integer, nullable=True)
    is_complete = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profiles")


class KYCRecord(Base):
    __tablename__ = "kyc_records"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    kyc_type = Column(String, default="DIGILOCKER")  # AADHAAR / PAN / DIGILOCKER
    status = Column(String, default="PENDING")        # PENDING / COMPLETED / FAILED / EXPIRED
    kyc_ref_id = Column(String, nullable=True)
    pan_number = Column(String, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="kyc_records")
