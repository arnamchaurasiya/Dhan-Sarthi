"""
Dhan Sarthi — Audit Event Query API
TDD Section 10 — Centralized Audit & Event Layer

Exposes endpoints for compliance officers to inspect audit trails:
- GET /api/v1/audit/events — list/filter audit events by user_id or event_type
- GET /api/v1/audit/events/summary — total events breakdown by type and severity
"""
from fastapi import APIRouter, Query
from typing import Optional, List

from app.core.audit import get_audit_log, get_audit_log_by_type, get_audit_summary

router = APIRouter(prefix="/api/v1/audit", tags=["audit-trail"])


@router.get("/events")
def list_audit_events(
    user_id: Optional[str] = Query(None, description="Filter events by user_id"),
    event_type: Optional[str] = Query(None, description="Filter events by event_type"),
    limit: int = Query(50, le=200, description="Max number of events to return"),
):
    """
    Query the audit event log (Compliance Officer / Admin interface).
    Supports filtering by user_id and event_type.
    """
    if event_type:
        events = get_audit_log_by_type(event_type)
        if user_id:
            events = [e for e in events if e.get("user_id") == user_id]
    else:
        events = get_audit_log(user_id)

    # Return newest events first
    sorted_events = sorted(events, key=lambda x: x.get("timestamp", ""), reverse=True)

    return {
        "events": sorted_events[:limit],
        "total_matched": len(events),
        "limit": limit,
        "note": "Hackathon: in-memory event bus. Production: PostgreSQL audit_events table.",
    }


@router.get("/events/summary")
def get_summary():
    """Summary metrics of all audit events emitted in the session."""
    return get_audit_summary()
