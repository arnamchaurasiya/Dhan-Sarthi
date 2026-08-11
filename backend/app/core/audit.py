"""
Dhan Sarthi — Centralized Audit & Event Layer
In-memory implementation for hackathon. All services call publish_event().

Production upgrade path:
  1. Replace _audit_log list with a write to the audit_events PostgreSQL table
  2. Also publish to a Kafka topic for real-time alerting / compliance monitoring
  3. DLQ: failed publishes → dead-letter queue for manual review

TDD Reference: Section 10 — Centralized Audit & Event Layer
"""
from datetime import datetime
from typing import Optional, List
import uuid

# ── In-memory audit store (hackathon) ──────────────────────────────────────
_audit_log: List[dict] = []

# ── Validated event catalogue (all 23 defined in TDD) ──────────────────────
VALID_EVENTS = {
    # Auth
    "AUTH_LOGIN", "AUTH_FAILED",
    # KYC
    "KYC_COMPLETED", "KYC_FAILED",
    # Consent
    "AA_CONSENT_GRANTED", "AA_CONSENT_REVOKED", "AA_CONSENT_EXPIRED",
    "AA_CONSENT_RENEWED", "AA_CONSENT_VIEWED",
    # Portfolio
    "PORTFOLIO_SYNCHRONIZED", "PORTFOLIO_SYNC_FAILED",
    # Risk
    "RISK_PROFILE_SET",
    # Suitability
    "SUITABILITY_COMPLETED",
    # Knowledge
    "KNOWLEDGE_CHECK_PASSED", "KNOWLEDGE_CHECK_FAILED",
    # Safety / Rakshak
    "SCAM_DETECTED", "SCAM_SCAN_CLEAN", "ENTITY_VERIFIED", "ENTITY_UNVERIFIED",
    # Investment gateway
    "INVESTMENT_AUTHORIZED", "INVESTMENT_DENIED",
    # Orders
    "ORDER_CREATED", "ORDER_EXECUTED", "ORDER_FAILED",
    # Portfolio update
    "PORTFOLIO_UPDATED",
    # Consent errors
    "CONSENT_MANAGER_ERROR",
}


def publish_event(
    event_type: str,
    user_id: str,
    service: str,
    payload: dict,
    severity: str = "MEDIUM",
    session_id: Optional[str] = None,
) -> dict:
    """
    Publish a structured audit event.

    Args:
        event_type:  One of the 23 validated event types defined in VALID_EVENTS.
        user_id:     The investor's user ID (or phone for pre-registration events).
        service:     The service name emitting this event (e.g. 'auth_service', 'consent_service').
        payload:     Structured event data — must be JSON-serializable.
        severity:    HIGH / MEDIUM / LOW / CRITICAL
        session_id:  Optional session/request correlation ID.

    Returns:
        The fully constructed audit event dict.
    """
    if event_type not in VALID_EVENTS:
        # Soft-fail: log unknown event but don't crash the request
        event_type = f"UNKNOWN_{event_type}"

    event = {
        "event_id": str(uuid.uuid4()),
        "event_type": event_type,
        "user_id": str(user_id),
        "session_id": session_id or str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": service,
        "payload": payload,
        "severity": severity,
    }
    _audit_log.append(event)
    return event


def get_audit_log(user_id: Optional[str] = None) -> List[dict]:
    """Return all events, optionally filtered by user_id."""
    if user_id:
        return [e for e in _audit_log if e["user_id"] == user_id]
    return list(_audit_log)


def get_audit_log_by_type(event_type: str) -> List[dict]:
    """Return all events of a specific type."""
    return [e for e in _audit_log if e["event_type"] == event_type]


def get_audit_summary() -> dict:
    """Return event counts grouped by type and severity."""
    from collections import Counter
    type_counts = Counter(e["event_type"] for e in _audit_log)
    severity_counts = Counter(e["severity"] for e in _audit_log)
    return {
        "total_events": len(_audit_log),
        "by_type": dict(type_counts),
        "by_severity": dict(severity_counts),
        "high_severity_count": severity_counts.get("HIGH", 0) + severity_counts.get("CRITICAL", 0),
    }
