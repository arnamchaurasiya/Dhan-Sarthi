"""
Dhan Sarthi — AuditEventRecord Model (PostgreSQL persistence layer)
TDD Section 10.4 — Audit Log Database Table

Hackathon: the in-memory audit bus (core/audit.py) is the primary store.
This model provides the production-ready PostgreSQL persistence layer.
In production: every publish_event() call also writes an AuditEventRecord row.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Index, ForeignKey
try:
    from sqlalchemy import JSON
except ImportError:
    from sqlalchemy.dialects.sqlite import JSON
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class AuditEventRecord(Base):
    """
    Persistent audit event record for production.
    In the hackathon, the in-memory list in core/audit.py is used.
    This table is the production upgrade path.
    """
    __tablename__ = "audit_events"

    id = Column(String, primary_key=True, default=_uuid)
    event_type = Column(String, nullable=False, index=True)
    user_id = Column(String, nullable=True, index=True)      # Not FK — events can predate users
    session_id = Column(String, nullable=True)
    service = Column(String, nullable=False)                 # Emitting service name
    payload = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    # Severity: HIGH / MEDIUM / LOW / CRITICAL
    severity = Column(String, default="MEDIUM")
    ip_hash = Column(String, nullable=True)                  # Hashed IP for privacy
    device_id = Column(String, nullable=True)

    __table_args__ = (
        Index("ix_audit_events_user_type", "user_id", "event_type"),
        Index("ix_audit_events_severity_ts", "severity", "timestamp"),
    )
