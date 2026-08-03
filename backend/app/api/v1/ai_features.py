from fastapi import APIRouter
from pydantic import BaseModel

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

@router.post("/ask-gyaan")
def ask_gyaan(request: GyaanQuery):
    # In production, this would call Gemini API with LangChain
    return {
        "topic": request.query,
        "language": request.language,
        "explanation": f"This is an AI-generated 5-minute explanation about {request.query} in {request.language}. " 
                       f"It uses simple vernacular language to explain complex financial concepts like compounding and diversification.",
        "badge_awarded": "Curious Learner"
    }

@router.post("/invest/suitability")
def check_suitability(request: SuitabilityRequest):
    # In production, this would use a scikit-learn model or Gemini Agent
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
    # In production, this uses HuggingFace Transformers for anomaly/sentiment detection
    suspicious_keywords = ["guaranteed returns", "double your money", "sure shot", "tips"]
    is_scam = any(word in request.text.lower() for word in suspicious_keywords)
    probability = 0.89 if is_scam else 0.05
    return {
        "is_scam": is_scam,
        "scam_probability": probability,
        "warning": "HIGH RISK: Our AI predicts an 89% probability this is a pump-and-dump scheme." if is_scam else "Looks safe, but always do your own research."
    }
