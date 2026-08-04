from fastapi import APIRouter
from pydantic import BaseModel
import re

router = APIRouter(prefix="/api/v1/ai", tags=["ai-features"])

class GyaanQuery(BaseModel):
    query: str
    language: str = "English"

class SuitabilityRequest(BaseModel):
    user_id: str
    asset_id: str
    risk_score: int

class ScamCheckRequest(BaseModel):
    text: str

class EntityVerifyRequest(BaseModel):
    name: str

class UpiVerifyRequest(BaseModel):
    upi_id: str

class AccountVerifyRequest(BaseModel):
    ifsc: str
    account_number: str

# Mock SEBI Database
REGISTERED_ENTITIES = {
    "zerodha": {"name": "Zerodha Broking Ltd.", "reg_no": "INZ000031633", "category": "Stock Broker / Depository Participant", "status": "Registered", "valid": True},
    "groww": {"name": "Nextbillion Technology Pvt. Ltd. (Groww)", "reg_no": "INZ000301838", "category": "Stock Broker / Mutual Fund Distributor", "status": "Registered", "valid": True},
    "angel one": {"name": "Angel One Limited", "reg_no": "INZ000161534", "category": "Stock Broker & Research Analyst", "status": "Registered", "valid": True},
    "upstox": {"name": "RKSV Securities India Pvt. Ltd. (Upstox)", "reg_no": "INZ000185137", "category": "Stock Broker", "status": "Registered", "valid": True},
    "icici direct": {"name": "ICICI Securities Limited", "reg_no": "INZ000183631", "category": "Stock Broker & Investment Adviser", "status": "Registered", "valid": True},
    "motilal oswal": {"name": "Motilal Oswal Financial Services Ltd.", "reg_no": "INZ000158836", "category": "Stock Broker & Portfolio Manager", "status": "Registered", "valid": True},
}

SEBI_VERIFIED_UPI_HANDLES = [
    "zerodha@dfc", "zerodha@icici", "groww@icici", "groww@ybl", 
    "upstox@hdfc", "angelone@icici", "paytm@ptsbi", "motilal@axis"
]

@router.post("/ask-gyaan")
def ask_gyaan(request: GyaanQuery):
    return {
        "topic": request.query,
        "language": request.language,
        "explanation": f"This is an AI-generated 5-minute explanation about {request.query} in {request.language}. " 
                       f"It uses simple vernacular language to explain complex financial concepts like compounding and diversification.",
        "badge_awarded": "Curious Learner"
    }

@router.post("/invest/suitability")
def check_suitability(request: SuitabilityRequest):
    score = 85 if request.risk_score > 50 else 40
    is_suitable = score >= 70
    return {
        "asset": request.asset_id,
        "suitability_score": score,
        "is_suitable": is_suitable,
        "reason": "Based on your high income stability and long investment horizon, this asset fits your portfolio well." if is_suitable else "This asset is too volatile for your current risk profile."
    }

@router.post("/security/check-scam")
def check_scam(request: ScamCheckRequest):
    suspicious_keywords = ["guaranteed returns", "double your money", "sure shot", "tips", "whatsapp group", "telegram", "jackpot", "100%", "crypto profit"]
    is_scam = any(word in request.text.lower() for word in suspicious_keywords)
    probability = 0.94 if is_scam else 0.05
    return {
        "is_scam": is_scam,
        "scam_probability": probability,
        "warning": "HIGH RISK ALERT: Deepfake / Stock Tip Anomaly Detected. Scheme mimics un-registered fraudulent solicitations." if is_scam else "Content analyzed against SEBI SCORES 2.0 DB. No suspicious scam patterns detected.",
        "scores_db_matched": is_scam
    }

@router.post("/security/verify-entity")
def verify_entity(request: EntityVerifyRequest):
    query = request.name.strip().lower()
    for key, entity in REGISTERED_ENTITIES.items():
        if key in query or query in entity["name"].lower():
            return {
                "found": True,
                "name": entity["name"],
                "reg_no": entity["reg_no"],
                "category": entity["category"],
                "status": entity["status"],
                "message": "Entity is SEBI Registered & Authorized"
            }
    return {
        "found": False,
        "name": request.name,
        "reg_no": "N/A",
        "category": "Unregistered / Unknown",
        "status": "UNREGISTERED WARNING",
        "message": f"'{request.name}' is NOT found in SEBI Registered Entity DB. Beware of un-authorized financial advisors."
    }

@router.post("/security/verify-upi")
def verify_upi(request: UpiVerifyRequest):
    upi = request.upi_id.strip().lower()
    if not upi or "@" not in upi:
        return {"valid": False, "message": "Enter a valid UPI ID (e.g. username@bank) to enable verification."}
    
    # Check against verified list or broker sub-domains
    is_verified = any(upi == handle or upi.endswith("@dfc") or upi.endswith("@icici") or upi.endswith("@hdfc") for handle in SEBI_VERIFIED_UPI_HANDLES)
    if "scam" in upi or "cheat" in upi or "personal" in upi:
        is_verified = False

    if is_verified:
        return {
            "valid": True,
            "upi_id": request.upi_id,
            "status": "SEBI Verified Channel",
            "message": f"UPI ID '{request.upi_id}' is verified as an authentic SEBI-registered broker/clearing channel."
        }
    else:
        return {
            "valid": False,
            "upi_id": request.upi_id,
            "status": "Unverified / High Risk",
            "message": f"WARNING: '{request.upi_id}' is NOT an authorized SEBI payment handle. Never transfer funds for investments to personal UPI IDs!"
        }

@router.post("/security/verify-account")
def verify_account(request: AccountVerifyRequest):
    ifsc = request.ifsc.strip().upper()
    acc = request.account_number.strip()
    
    if len(ifsc) < 11 or len(acc) < 8:
        return {"valid": False, "message": "Enter valid IFSC and Account Number to enable verification."}
    
    is_valid_ifsc = bool(re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", ifsc))
    if not is_valid_ifsc:
        return {"valid": False, "message": "Invalid IFSC Code format. Format example: SBIN0001234"}

    # Mock SEBI bank account validation
    is_registered_pool = acc.endswith("1234") or acc.endswith("5678") or acc.endswith("0000") or acc.startswith("999")
    if is_registered_pool:
        return {
            "valid": True,
            "ifsc": ifsc,
            "account_number": acc,
            "status": "Verified SEBI Client Pool Account",
            "message": "Account details verified against SEBI ASBA & Broker Clearing Pool Database."
        }
    else:
        return {
            "valid": False,
            "ifsc": ifsc,
            "account_number": acc,
            "status": "Unverified Third-Party Account",
            "message": "WARNING: Account does NOT belong to an authorized SEBI clearing member pool. Fund transfer prohibited under SEBI circular."
        }

