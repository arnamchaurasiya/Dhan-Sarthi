from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_audit_event_logging_and_querying():
    # Perform actions that trigger audit events
    client.post("/api/v1/auth/login", json={"phone_number": "9876543210", "otp": "1234"})
    client.post("/api/v1/ai/security/check-scam", json={"text": "Guaranteed double money jackpot!"})

    # Query audit events endpoint
    res = client.get("/api/v1/audit/events")
    assert res.status_code == 200
    data = res.json()
    assert data["total_matched"] >= 2
    events = data["events"]
    event_types = [e["event_type"] for e in events]
    assert "AUTH_LOGIN" in event_types
    assert "SCAM_DETECTED" in event_types

    # Query summary
    summary_res = client.get("/api/v1/audit/events/summary")
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["total_events"] >= 2
    assert summary["high_severity_count"] >= 1
