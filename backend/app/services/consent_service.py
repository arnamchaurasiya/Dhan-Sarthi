"""
Dhan Sarthi — Consent Management Service
Full lifecycle: Grant → View → Renew → Revoke → Expire → Audit
TDD Section 7 — Consent Management Service

Every operation:
  1. Mutates the Consent record in the database
  2. Appends to the consent's own audit_trail JSON field
  3. Publishes a structured event to the centralized audit bus
"""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session

from app.models.consent import Consent
from app.core.audit import publish_event

CONSENT_DURATION_DAYS = 365   # 1-year consent window (Sahamati AA standard)


# ─── Grant ─────────────────────────────────────────────────────────────────────

def grant_consent(db: Session, user_id: str, fip_ids: list) -> Consent:
    """
    Grant a new AA consent for the user.
    Only one ACTIVE consent per user is allowed at a time.
    Returns the new Consent record.
    """
    # Expire any existing active consents first
    _expire_existing_active(db, user_id)

    now = datetime.utcnow()
    handle = f"consent-{uuid.uuid4().hex[:12]}"

    consent = Consent(
        user_id=user_id,
        consent_handle=handle,
        fip_ids=fip_ids,
        purpose="portfolio_aggregation_read_only",
        access_type="READ_ONLY",
        status="ACTIVE",
        granted_at=now,
        expires_at=now + timedelta(days=CONSENT_DURATION_DAYS),
        audit_trail=[{"event": "GRANTED", "timestamp": now.isoformat() + "Z", "fip_ids": fip_ids}],
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)

    publish_event(
        "AA_CONSENT_GRANTED", user_id, "consent_service",
        {"consent_id": consent.id, "consent_handle": handle, "fip_ids": fip_ids,
         "expires_at": consent.expires_at.isoformat() + "Z"},
        severity="HIGH",
    )
    return consent


# ─── View ──────────────────────────────────────────────────────────────────────

def get_active_consent(db: Session, user_id: str) -> Optional[Consent]:
    """Return the user's current ACTIVE consent, or None."""
    return db.query(Consent).filter(
        Consent.user_id == user_id,
        Consent.status == "ACTIVE"
    ).first()


def get_all_consents(db: Session, user_id: str) -> list:
    """Return all consent records for a user (for audit history)."""
    return db.query(Consent).filter(Consent.user_id == user_id).all()


# ─── Revoke ────────────────────────────────────────────────────────────────────

def revoke_consent(db: Session, consent_id: str, user_id: str, reason: str = "user_requested") -> Consent:
    """
    Revoke an active consent. Investor can always revoke at any time.
    SEBI AA Framework — investor's right to withdraw consent.
    """
    consent = db.query(Consent).filter(Consent.id == consent_id).first()
    if not consent:
        raise ValueError(f"Consent {consent_id} not found.")
    if consent.user_id != user_id:
        raise PermissionError("You can only revoke your own consent.")
    if consent.status == "REVOKED":
        raise ValueError("Consent is already revoked.")

    now = datetime.utcnow()
    consent.status = "REVOKED"
    consent.revoked_at = now
    consent.revocation_reason = reason
    trail = list(consent.audit_trail or [])
    trail.append({"event": "REVOKED", "timestamp": now.isoformat() + "Z", "reason": reason})
    consent.audit_trail = trail
    db.commit()
    db.refresh(consent)

    publish_event(
        "AA_CONSENT_REVOKED", user_id, "consent_service",
        {"consent_id": consent_id, "reason": reason},
        severity="HIGH",
    )
    return consent


# ─── Renew ─────────────────────────────────────────────────────────────────────

def renew_consent(db: Session, consent_id: str, user_id: str) -> Consent:
    """Extend an active (or expired) consent by another CONSENT_DURATION_DAYS."""
    consent = db.query(Consent).filter(Consent.id == consent_id).first()
    if not consent:
        raise ValueError(f"Consent {consent_id} not found.")
    if consent.user_id != user_id:
        raise PermissionError("You can only renew your own consent.")
    if consent.status == "REVOKED":
        raise ValueError("Revoked consent cannot be renewed. Grant a new consent instead.")

    now = datetime.utcnow()
    consent.expires_at = now + timedelta(days=CONSENT_DURATION_DAYS)
    consent.status = "ACTIVE"
    trail = list(consent.audit_trail or [])
    trail.append({"event": "RENEWED", "timestamp": now.isoformat() + "Z",
                  "new_expiry": consent.expires_at.isoformat() + "Z"})
    consent.audit_trail = trail
    db.commit()
    db.refresh(consent)

    publish_event(
        "AA_CONSENT_RENEWED", user_id, "consent_service",
        {"consent_id": consent_id, "new_expiry": consent.expires_at.isoformat() + "Z"},
        severity="MEDIUM",
    )
    return consent


# ─── Expire stale consents ─────────────────────────────────────────────────────

def expire_stale_consents(db: Session) -> int:
    """
    Mark all ACTIVE consents past their expires_at as EXPIRED.
    Should be called by a scheduled task / cron job.
    Returns the count of consents expired.
    """
    now = datetime.utcnow()
    stale = db.query(Consent).filter(
        Consent.status == "ACTIVE",
        Consent.expires_at < now
    ).all()

    for c in stale:
        c.status = "EXPIRED"
        trail = list(c.audit_trail or [])
        trail.append({"event": "EXPIRED", "timestamp": now.isoformat() + "Z"})
        c.audit_trail = trail
        publish_event(
            "AA_CONSENT_EXPIRED", c.user_id, "consent_service",
            {"consent_id": c.id},
            severity="MEDIUM",
        )

    if stale:
        db.commit()

    return len(stale)


# ─── Helpers ───────────────────────────────────────────────────────────────────

def _expire_existing_active(db: Session, user_id: str):
    """Expire any currently ACTIVE consent before granting a new one."""
    now = datetime.utcnow()
    existing = db.query(Consent).filter(
        Consent.user_id == user_id, Consent.status == "ACTIVE"
    ).all()
    for c in existing:
        c.status = "EXPIRED"
        trail = list(c.audit_trail or [])
        trail.append({"event": "SUPERSEDED", "timestamp": now.isoformat() + "Z",
                      "reason": "New consent granted"})
        c.audit_trail = trail
    if existing:
        db.commit()
