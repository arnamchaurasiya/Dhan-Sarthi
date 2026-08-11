from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

from unittest.mock import patch

def test_multilingual_ai_tutor_reit():
    languages = ["English", "Hindi", "Punjabi", "Tamil", "Telugu", "Marathi"]
    for lang in languages:
        response = client.post(
            "/api/v1/ai/ask-gyaan",
            json={"query": "What is REIT?", "language": lang}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["language"] == lang
        assert data["analogy_used"] is True
        assert "explanation" in data
        assert len(data["explanation"]) > 20
        assert data["quiz"]["reward_coins"] == 50
        assert data["ai_engine"] in ["gemini-1.5-flash", "rule-engine"]

def test_gemini_mocked_tutor_response():
    mock_gemini_payload = {
        "explanation": "REITs are real estate investment trusts.",
        "analogy": "Like owning a slice of a shopping mall.",
        "badge_awarded": "REIT Scholar",
        "quiz": {
            "question": "What is a REIT?",
            "options": ["Real Estate Trust", "Bond", "Crypto", "Commodity"],
            "correct_index": 0,
            "reward_coins": 50
        }
    }
    with patch("app.api.v1.ai_features.query_gemini_gyaan_tutor", return_value=mock_gemini_payload):
        res = client.post(
            "/api/v1/ai/ask-gyaan",
            json={"query": "Explain REITs", "language": "English"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["ai_engine"] == "gemini-1.5-flash"
        assert "slice of a shopping mall" in data["explanation"].lower()
        assert data["badge_awarded"] == "REIT Scholar"
        assert data["quiz"]["correct_index"] == 0

def test_multilingual_ai_tutor_mutual_funds_and_bonds():
    topics = ["How do Mutual Funds work?", "What are Bonds?"]
    for topic in topics:
        response = client.post(
            "/api/v1/ai/ask-gyaan",
            json={"query": topic, "language": "Hindi"}
        )
        assert response.status_code == 200
        assert response.json()["language"] == "Hindi"
        assert response.json()["analogy_used"] is True

def test_personalized_path_variations():
    # Test young investor with high equity
    res1 = client.post(
        "/api/v1/ai/personalized-path",
        json={"user_id": "u1", "age": 22, "monthly_income": 50000, "equity_pct": 90}
    )
    assert res1.status_code == 200
    assert res1.json()["profile"]["name"] == "Arnam"
    assert len(res1.json()["recommended_path"]) == 5
    assert res1.json()["current_active_course"]["progress_pct"] == 70

    # Test older investor with low equity
    res2 = client.post(
        "/api/v1/ai/personalized-path",
        json={"user_id": "u2", "age": 55, "monthly_income": 150000, "equity_pct": 40}
    )
    assert res2.status_code == 200
    assert "40% Equity" in res2.json()["profile"]["portfolio_mix"]

def test_explain_portfolio_risk_warnings():
    # 100% Equity Portfolio
    res_high = client.post(
        "/api/v1/ai/explain-portfolio",
        json={
            "user_id": "u1",
            "holdings": [
                {"name": "Reliance Industries", "amount": 120000, "category": "Equity"},
                {"name": "HDFC Mutual Fund", "amount": 80000, "category": "Equity"}
            ]
        }
    )
    assert res_high.status_code == 200
    assert res_high.json()["portfolio_summary"]["equity_exposure_pct"] == 100.0
    assert "High Concentration Risk" in res_high.json()["portfolio_summary"]["warning"]

    # Balanced Portfolio
    res_bal = client.post(
        "/api/v1/ai/explain-portfolio",
        json={
            "user_id": "u2",
            "holdings": [
                {"name": "Reliance Industries", "amount": 50000, "category": "Equity"},
                {"name": "Government Bond 2030", "amount": 50000, "category": "Debt"}
            ]
        }
    )
    assert res_bal.status_code == 200
    assert res_bal.json()["portfolio_summary"]["equity_exposure_pct"] == 50.0
    assert "Balanced Portfolio Exposure" in res_bal.json()["portfolio_summary"]["warning"]

def test_before_you_invest_readiness():
    assets = ["REIT", "Corporate Bond", "F&O Option"]
    for asset in assets:
        response = client.post(
            "/api/v1/ai/before-you-invest",
            json={"user_id": "u1", "asset_name": asset, "asset_category": "Investment Asset"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["asset_name"] == asset
        assert data["readiness_score"] > 50
        assert len(data["checklist"]) == 4
        assert "Complete 3-minute lesson" in data["action_text"]

def test_smart_checkpoint_decision_support():
    assets_to_test = [
        {"name": "Nexus Select REIT", "cat": "Commercial Real Estate Trust"},
        {"name": "RBI Retail Direct Sovereign Bonds", "cat": "Government Bond"},
        {"name": "TCS Direct Equity", "cat": "Stock"}
    ]
    for asset in assets_to_test:
        response = client.post(
            "/api/v1/ai/smart-checkpoint",
            json={
                "user_id": "u1",
                "asset_name": asset["name"],
                "asset_category": asset["cat"],
                "investment_amount": 50000.0
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["asset_name"] == asset["name"]
        assert len(data["questions"]) == 2
        assert data["understanding_score"] == 85
        assert data["proceed_authorized"] is True
        assert "understood_topics" in data["behavioral_profile_update"]
