"""
Dhan Sarthi — Consent Management API
TDD Section 7 — Consent Management Service
Endpoints: grant / view / revoke / renew / history
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.audit import get_audit_log
from app.services import consent_service

router = APIRouter(prefix="/api/v1/consent", tags=["consent-management"])


# ─── Request / Response models ─────────────────────────────────────────────────

class GrantRequest(BaseModel):
    user_id: str
    fip_ids: List[str] = ["zerodha_cdsl", "groww_cams", "kuvera_kfintech", "rbi_retail_direct"]

class RevokeRequest(BaseModel):
    user_id: str
    reason: Optional[str] = "user_requested"


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/grant")
def grant_consent(request: GrantRequest, db: Session = Depends(get_db)):
    """Grant AA consent — Read-only portfolio access."""
    consent = consent_service.grant_consent(db, request.user_id, request.fip_ids)
    return {
        "status": "ACTIVE",
        "consent_id": consent.id,
        "consent_handle": consent.consent_handle,
        "user_id": consent.user_id,
        "fip_ids": consent.fip_ids,
        "access_type": consent.access_type,
        "granted_at": consent.granted_at.isoformat() + "Z" if consent.granted_at else None,
        "expires_at": consent.expires_at.isoformat() + "Z" if consent.expires_at else None,
        "message": "Consent granted. Read-only AA portfolio access is now ACTIVE.",
    }


@router.get("/view/{user_id}")
def view_consent(user_id: str, db: Session = Depends(get_db)):
    """View the current active consent for a user."""
    consent = consent_service.get_active_consent(db, user_id)
    if not consent:
        return {
            "status": "NO_ACTIVE_CONSENT",
            "user_id": user_id,
            "message": "No active consent found. Grant consent to enable portfolio sync.",
        }
    return {
        "status": consent.status,
        "consent_id": consent.id,
        "consent_handle": consent.consent_handle,
        "fip_ids": consent.fip_ids,
        "access_type": consent.access_type,
        "granted_at": consent.granted_at.isoformat() + "Z" if consent.granted_at else None,
        "expires_at": consent.expires_at.isoformat() + "Z" if consent.expires_at else None,
    }


@router.post("/revoke/{consent_id}")
def revoke_consent(consent_id: str, request: RevokeRequest, db: Session = Depends(get_db)):
    """Revoke an active consent. Investor may revoke at any time."""
    try:
        consent = consent_service.revoke_consent(db, consent_id, request.user_id, request.reason or "user_requested")
        return {
            "status": "REVOKED",
            "consent_id": consent.id,
            "revoked_at": consent.revoked_at.isoformat() + "Z" if consent.revoked_at else None,
            "message": "Consent revoked. Portfolio sync access has been removed.",
        }
    except (ValueError, PermissionError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/renew/{consent_id}")
def renew_consent(consent_id: str, user_id: str, db: Session = Depends(get_db)):
    """Renew a consent — extends expiry by 365 days."""
    try:
        consent = consent_service.renew_consent(db, consent_id, user_id)
        return {
            "status": "RENEWED",
            "consent_id": consent.id,
            "new_expiry": consent.expires_at.isoformat() + "Z" if consent.expires_at else None,
            "message": "Consent renewed for another 365 days.",
        }
    except (ValueError, PermissionError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/history/{user_id}")
def consent_history(user_id: str, db: Session = Depends(get_db)):
    """Full consent audit history from both DB and audit bus."""
    all_consents = consent_service.get_all_consents(db, user_id)
    audit_events = [
        e for e in get_audit_log(user_id)
        if e["event_type"].startswith("AA_CONSENT")
    ]
    return {
        "user_id": user_id,
        "consent_records": [
            {
                "consent_id": c.id,
                "status": c.status,
                "granted_at": c.granted_at.isoformat() + "Z" if c.granted_at else None,
                "expires_at": c.expires_at.isoformat() + "Z" if c.expires_at else None,
                "revoked_at": c.revoked_at.isoformat() + "Z" if c.revoked_at else None,
                "revocation_reason": c.revocation_reason,
                "audit_trail": c.audit_trail,
            }
            for c in all_consents
        ],
        "audit_events": audit_events,
        "total_events": len(audit_events),
    }
