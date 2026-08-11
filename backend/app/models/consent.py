"""
Dhan Sarthi — Consent & FIP Models
TDD Section 12.2 — Consent & AA entities
Full lifecycle: PENDING → APPROVED → ACTIVE → EXPIRED / REVOKED
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
try:
    from sqlalchemy import JSON
except ImportError:
    from sqlalchemy.dialects.sqlite import JSON
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class FIP(Base):
    """Financial Information Provider — broker, depository, MF RTA, bank."""
    __tablename__ = "fips"

    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String, nullable=False)
    fip_type = Column(String, default="BROKER")  # BROKER / DEPOSITORY / MF_RTA / BANK
    aa_compatible = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)


class Consent(Base):
    """
    AA Consent record. One active consent per user at a time.
    TDD Section 7 — Consent Management Service.
    """
    __tablename__ = "consents"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    consent_handle = Column(String, unique=True, nullable=False)
    fip_ids = Column(JSON, default=list)                          # ["zerodha_cdsl", "groww_cams"]
    purpose = Column(String, default="portfolio_aggregation_read_only")
    access_type = Column(String, default="READ_ONLY")
    # Status lifecycle: PENDING → APPROVED → ACTIVE → EXPIRED / REVOKED
    status = Column(String, default="PENDING", index=True)
    granted_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)
    revocation_reason = Column(String, nullable=True)
    audit_trail = Column(JSON, default=list)   # List of {event, timestamp} dicts
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="consents")
