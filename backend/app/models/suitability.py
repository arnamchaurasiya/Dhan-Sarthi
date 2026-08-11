"""
Dhan Sarthi — Suitability Models: RiskProfile, SuitabilityAssessment, SuitabilityFactor
TDD Section 12.2 — Suitability entities
Persists every multi-factor authorization decision for audit and SEBI compliance.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
try:
    from sqlalchemy import JSON
except ImportError:
    from sqlalchemy.dialects.sqlite import JSON
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class RiskProfile(Base):
    """
    Persisted result of the 4-question RISK_QUESTIONNAIRE.
    Conservative (4-5) / Moderate (6-8) / Aggressive (9-12).
    """
    __tablename__ = "risk_profiles"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    questionnaire_version = Column(String, default="v1")
    responses = Column(JSON, default=dict)                 # {q1: "sell", q2: "balanced", ...}
    total_score = Column(Integer, nullable=False)
    risk_classification = Column(String, nullable=False)   # Conservative / Moderate / Aggressive
    assessed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="risk_profiles")


class SuitabilityAssessment(Base):
    """
    The core authorization record. Stores all gate results and the final decision.
    TDD Section 3.2 — Investment Authorization Decision Object.
    """
    __tablename__ = "suitability_assessments"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    instrument_id = Column(String, nullable=False)          # asset symbol / ID
    risk_profile_id = Column(String, ForeignKey("risk_profiles.id"), nullable=True)
    suitability_score = Column(Float, nullable=False)
    all_gates_result = Column(JSON, default=dict)           # Full gate-by-gate breakdown
    investment_authorized = Column(Boolean, default=False, index=True)
    authorized_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    denial_reasons = Column(JSON, default=list)             # Actionable denial messages
    created_at = Column(DateTime, default=datetime.utcnow)

    factors = relationship(
        "SuitabilityFactor", back_populates="assessment", cascade="all, delete-orphan"
    )


class SuitabilityFactor(Base):
    """
    Per-factor breakdown of the suitability assessment.
    Mirrors getExplainabilityMatrix() from margData.ts.
    """
    __tablename__ = "suitability_factors"

    id = Column(String, primary_key=True, default=_uuid)
    assessment_id = Column(String, ForeignKey("suitability_assessments.id"), nullable=False, index=True)
    factor_name = Column(String, nullable=False)            # Risk / Horizon / Goal / Liquidity / Portfolio
    user_value = Column(String, nullable=False)             # e.g. "Moderate"
    product_value = Column(String, nullable=False)          # e.g. "Moderate"
    matched = Column(Boolean, nullable=False)
    result_tag = Column(String, nullable=False)             # e.g. "✅ Aligned Risk Profile"
    points_awarded = Column(Integer, default=0)             # 0 or 20

    assessment = relationship("SuitabilityAssessment", back_populates="factors")
