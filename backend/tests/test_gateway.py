from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_gateway_denied_due_to_missing_kyc_and_consent():
    user_id = "user_no_kyc"
    res = client.post("/api/v1/gateway/authorize", json={
        "user_id": user_id,
        "asset_id": "REIT1",
        "investor_profile": {
            "risk_profile": "Moderate",
            "investment_horizon": "5–10 years",
            "primary_goal": "Regular Income",
            "liquidity_need": "Medium",
            "equity_pct": 50.0
        },
        "instrument": {
            "risk_level": "Moderate",
            "liquidity_level": "Medium",
            "horizon_req": "5+ years",
            "asset_class": "REIT",
            "name": "Nexus REIT"
        },
        "knowledge_score": 85,
        "portfolio_impact": {"new_asset_pct": 12.0},
        "entity_verified": True,
        "scam_scan_clean": True,
        "disclosures_acknowledged": True
    })
    assert res.status_code == 200
    data = res.json()
    assert data["investment_authorized"] is False
    assert any("KYC not completed" in r for r in data["denial_reasons"])
    assert any("AA consent not active" in r for r in data["denial_reasons"])

def test_gateway_all_gates_pass():
    user_id = "user_fully_verified"

    # First complete KYC and Grant Consent
    client.post("/api/v1/auth/ekyc", json={"pan_number": "ABCDE1234F", "aadhaar_number": "123456789012", "user_id": user_id})
    client.post("/api/v1/consent/grant", json={"user_id": user_id, "fip_ids": ["zerodha_cdsl"]})

    # Now authorize investment
    res = client.post("/api/v1/gateway/authorize", json={
        "user_id": user_id,
        "asset_id": "NEXUS_REIT",
        "investor_profile": {
            "risk_profile": "Moderate",
            "investment_horizon": "5–10 years",
            "primary_goal": "Regular Income",
            "liquidity_need": "Medium",
            "equity_pct": 50.0
        },
        "instrument": {
            "risk_level": "Moderate",
            "liquidity_level": "Medium",
            "horizon_req": "5+ years",
            "asset_class": "REIT",
            "name": "Nexus Select REIT"
        },
        "knowledge_score": 85,
        "portfolio_impact": {"new_asset_pct": 12.1},
        "entity_verified": True,
        "scam_scan_clean": True,
        "disclosures_acknowledged": True
    })

    assert res.status_code == 200
    data = res.json()
    assert data["investment_authorized"] is True
    assert len(data["denial_reasons"]) == 0
    assert data["gates"]["eligibility_check"] == "PASS"
    assert data["gates"]["risk_check"] == "PASS"
    assert data["gates"]["suitability_check"] == "PASS"
    assert data["gates"]["knowledge_check"] == "PASS"
    assert data["gates"]["safety_check"] == "PASS"

    # Check status endpoint
    auth_id = data["authorization_id"]
    status_res = client.get(f"/api/v1/gateway/status/{auth_id}")
    assert status_res.status_code == 200
    assert status_res.json()["investment_authorized"] is True
