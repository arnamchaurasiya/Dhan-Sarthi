from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter(prefix="/api/v1/mock-dpi", tags=["mock-dpi"])

class ConsentRequest(BaseModel):
    user_id: str
    fip_ids: list[str]
    
@router.post("/aa/consent")
def submit_aa_consent(request: ConsentRequest):
    # Simulate a network delay for the consent flow
    # time.sleep(1)
    return {
        "status": "APPROVED",
        "consent_handle": "mock-consent-handle-84920",
        "message": "Consent granted to fetch data from FIPs."
    }

@router.get("/aa/fetch-holdings/{consent_handle}")
def fetch_holdings(consent_handle: str):
    if consent_handle != "mock-consent-handle-84920":
        return {"error": "Invalid consent handle"}
    
    # Returning a realistic, unified mock payload across asset classes
    return {
        "status": "SUCCESS",
        "data": {
            "summary": {
                "total_net_worth": 692450.00,
                "todays_gain": 48240.00,
                "todays_gain_percentage": 7.48
            },
            "holdings": [
                {
                    "broker": "Zerodha (CDSL)",
                    "asset_class": "Direct Equity",
                    "symbol": "TCS",
                    "quantity": 50,
                    "avg_price": 3500.0,
                    "current_price": 3821.0,
                    "total_value": 191050.0
                },
                {
                    "broker": "Zerodha (CDSL)",
                    "asset_class": "Direct Equity",
                    "symbol": "HDFCBANK",
                    "quantity": 100,
                    "avg_price": 1600.0,
                    "current_price": 1910.5,
                    "total_value": 191050.0
                },
                {
                    "broker": "Groww (CAMS)",
                    "asset_class": "Mutual Funds",
                    "symbol": "Parag Parikh Flexi Cap Direct",
                    "quantity": 2500.5,
                    "avg_price": 65.0,
                    "current_price": 72.4,
                    "total_value": 181050.0
                },
                {
                    "broker": "Kuvera (KFintech)",
                    "asset_class": "Mutual Funds",
                    "symbol": "UTI Nifty 50 Index",
                    "quantity": 600.0,
                    "avg_price": 140.0,
                    "current_price": 148.83,
                    "total_value": 89300.0
                },
                {
                    "broker": "Dhan Sarthi (Direct)",
                    "asset_class": "Real Estate",
                    "symbol": "Nexus Select Trust REIT",
                    "quantity": 300,
                    "avg_price": 130.0,
                    "current_price": 133.33,
                    "total_value": 40000.0
                }
            ]
        }
    }
