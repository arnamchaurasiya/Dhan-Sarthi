from fastapi import APIRouter
from pydantic import BaseModel
from app.core.audit import publish_event

router = APIRouter(prefix="/api/v1/mock-dpi", tags=["mock-dpi"])

class ConsentRequest(BaseModel):
    user_id: str = "demo_user"
    fip_ids: list[str] = ["zerodha_cdsl", "groww_cams", "kuvera_kfintech"]

@router.post("/aa/consent")
def submit_aa_consent(request: ConsentRequest):
    handle = "mock-consent-handle-84920"
    publish_event(
        "AA_CONSENT_GRANTED", request.user_id, "mock_dpi",
        {"consent_handle": handle, "fip_ids": request.fip_ids},
        severity="HIGH"
    )
    return {
        "status": "APPROVED",
        "consent_handle": handle,
        "message": "Consent granted to fetch data from FIPs."
    }

@router.get("/aa/fetch-holdings/{consent_handle}")
def fetch_holdings(consent_handle: str):
    if consent_handle != "mock-consent-handle-84920":
        publish_event(
            "PORTFOLIO_SYNC_FAILED", "unknown", "mock_dpi",
            {"handle": consent_handle, "reason": "invalid_handle"},
            severity="HIGH"
        )
        return {"error": "Invalid consent handle"}

    publish_event(
        "PORTFOLIO_SYNCHRONIZED", "demo_user", "mock_dpi",
        {"consent_handle": consent_handle, "asset_classes": 6, "total_net_worth": 793450.00},
        severity="MEDIUM"
    )

    return {
        "status": "SUCCESS",
        "data": {
            "summary": {
                "total_net_worth": 793450.00,
                "todays_gain": 48240.00,
                "todays_gain_percentage": 6.47
            },
            "holdings": [
                {
                    "broker": "Zerodha (CDSL)",
                    "asset_class": "Equity",
                    "symbol": "TCS",
                    "quantity": 50,
                    "avg_price": 3500.0,
                    "current_price": 4364.0,
                    "total_value": 218200.0
                },
                {
                    "broker": "Zerodha (CDSL)",
                    "asset_class": "Equity",
                    "symbol": "HDFCBANK",
                    "quantity": 100,
                    "avg_price": 1600.0,
                    "current_price": 2181.97,
                    "total_value": 218197.0
                },
                {
                    "broker": "Groww (CAMS)",
                    "asset_class": "Mutual Funds",
                    "symbol": "Parag Parikh Flexi Cap Direct",
                    "quantity": 2500.5,
                    "avg_price": 45.0,
                    "current_price": 51.99,
                    "total_value": 130000.0
                },
                {
                    "broker": "Kuvera (KFintech)",
                    "asset_class": "Mutual Funds",
                    "symbol": "UTI Nifty 50 Index",
                    "quantity": 450.0,
                    "avg_price": 140.0,
                    "current_price": 151.91,
                    "total_value": 68362.0
                },
                {
                    "broker": "Dhan Sarthi (Direct)",
                    "asset_class": "Fixed Income",
                    "symbol": "INCREDBOND",
                    "quantity": 1,
                    "avg_price": 75000.0,
                    "current_price": 79345.0,
                    "total_value": 79345.0
                },
                {
                    "broker": "RBI Retail Direct",
                    "asset_class": "Gold",
                    "symbol": "SGB2030",
                    "quantity": 8,
                    "avg_price": 6500.0,
                    "current_price": 6942.6,
                    "total_value": 55541.0
                },
                {
                    "broker": "Dhan Sarthi (Direct)",
                    "asset_class": "REITs",
                    "symbol": "NEXUSREIT",
                    "quantity": 180,
                    "avg_price": 125.0,
                    "current_price": 132.25,
                    "total_value": 23805.0
                }
            ]
        }
    }
