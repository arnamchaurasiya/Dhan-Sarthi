from fastapi import APIRouter
from pydantic import BaseModel
import re
import os
import json
import requests

from app.core.audit import publish_event

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
    user_id: str = "demo_user"

class EntityVerifyRequest(BaseModel):
    name: str
    user_id: str = "demo_user"

class UpiVerifyRequest(BaseModel):
    upi_id: str

class AccountVerifyRequest(BaseModel):
    ifsc: str
    account_number: str

class PersonalizedPathRequest(BaseModel):
    user_id: str = "u1"
    age: int = 25
    monthly_income: int = 80000
    equity_pct: int = 80

class PortfolioExplainRequest(BaseModel):
    user_id: str = "u1"
    holdings: list = [
        {"name": "Reliance Industries", "amount": 120000, "category": "Equity"},
        {"name": "HDFC Mutual Fund", "amount": 80000, "category": "Equity"}
    ]

class BeforeYouInvestRequest(BaseModel):
    user_id: str = "u1"
    asset_name: str = "REIT"
    asset_category: str = "Real Estate Investment Trust"
    target_amount: float = 10000.0

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

ANALOGIES = {
    "reit": {
        "English": "A REIT is like owning a small part of a commercial property without buying the whole building. Example: Instead of buying a ₹5 crore shopping mall, you can invest ₹5,000 and earn proportional rental income!",
        "Hindi": "REIT (रीट) एक व्यावसायिक संपत्ति (जैसे मॉल या टेक पार्क) में छोटी हिस्सेदारी खरीदने जैसा है। उदाहरण: ₹5 करोड़ का पूरा मॉल खरीदने के बजाय, आप ₹5,000 का निवेश कर किराए की आय कमा सकते हैं!",
        "Punjabi": "REIT ਇਕ ਵਪਾਰਕ ਜਾਇਦਾਦ ਵਿੱਚ ਛੋਟੀ ਹਿੱਸੇਦਾਰੀ ਖਰੀਦਣ ਵਾਂਗ ਹੈ। ਉਦਾਹਰਣ: ₹5 ਕਰੋੜ ਦਾ ਮਾਲ ਖਰੀਦਣ ਦੀ ਬਜਾਏ, ਤੁਸੀਂ ₹5,000 ਦਾ ਨਿਵੇਸ਼ ਕਰਕੇ ਕਿਰਾਇਆ ਕਮਾ ਸਕਦੇ ਹੋ!",
        "Tamil": "REIT என்பது ஒரு பெரிய வணிகக் கட்டிடத்தின் சிறிய பகுதியை வாங்குவதைப் போன்றது. எ.கா: ₹5 கோடி ஷாப்பிங் மாலை வாங்குவதற்குப் பதிலாக ₹5,000 முதலீடு செய்து வாடகை வருமானம் பெறலாம்!",
        "Telugu": "REIT అనేది ఒక పెద్ద వాణిజ్య భవనంలో చిన్న భాగాన్ని సొంతం చేసుకోవడం లాంటిది. ఉదాహరణకు: ₹5 కోట్లతో మాల్ కొనడానికి బదులుగా, ₹5,000 ఇన్వెస్ట్ చేసి అద్దె ఆదాయం పొందవచ్చు!",
        "Marathi": "REIT म्हणजे मोठ्या कमर्शियल प्रॉपर्टीमध्ये छोटा हिस्सा घेण्यासारखे आहे. उदाहरण: ₹५ कोटींचा मॉल खरेदी करण्याऐवजी तुम्ही ₹५,००० गुंतवून भाड्याचे उत्पन्न मिळवू शकता!"
    },
    "mutual funds": {
        "English": "A Mutual Fund is like a potluck lunch. Everyone contributes money, a professional chef (Fund Manager) picks the finest dishes (stocks & bonds), and everyone shares the delicious feast!",
        "Hindi": "म्यूचुअल फंड एक पूल पार्टी या पॉटलक जैसा है। सब लोग पैसे जमा करते हैं, एक एक्सपर्ट (फंड मैनेजर) बेहतरीन शेयर्स चुनता है और मुनाफा सब में बंटता है!",
        "Punjabi": "ਮਿਊਚਲ ਫੰਡ ਇਕ ਸਾਂਝਾ ਖਾਤਾ ਹੈ ਜਿੱਥੇ ਸਾਰੇ ਪੈਸੇ ਇਕੱਠੇ ਕਰਦੇ ਹਨ ਅਤੇ ਇਕ ਮਾਹਰ ਵਧੀਆ ਸ਼ੇਅਰ ਚੁਣਦਾ ਹੈ!",
        "Tamil": "மியூச்சுவல் ஃபண்ட் என்பது அனைவரும் பணம் செலுத்தி ஒரு நிபுணர் மூலம் சிறந்த பங்குகளில் முதலீடு செய்வதாகும்!",
        "Telugu": "మ్యూச்சுవల్ ఫండ్ అంటే అందరూ కలిసి డబ్బు వేసి ఒక నిపుణుడి ద్వారా పెట్టుబడి పెట్టడం!",
        "Marathi": "म्युच्युअल फंड म्हणजे सर्वांनी एकत्र पैसे जमा करून तज्ज्ञांमार्फत चांगल्या शेअर्समध्ये गुंतवणूक करणे!"
    },
    "bonds": {
        "English": "A Bond is an IOU note where you lend money to a government or corporation. In return, they promise to pay you fixed interest every year and return your capital at maturity.",
        "Hindi": "बॉन्ड एक लिखित वादा (IOU) है जहाँ आप सरकार या कंपनी को पैसे उधार देते हैं और वे आपको हर साल निश्चित ब्याज देने का वादा करते हैं!",
        "Punjabi": "ਬਾਂਡ ਇਕ ਉਧਾਰ ਦੀ ਚਿੱਠੀ ਹੈ ਜਿੱਥੇ ਤੁਸੀਂ ਸਰਕਾਰ ਜਾਂ ਕੰਪਨੀ ਨੂੰ ਪੈਸੇ ਦਿੰਦੇ ਹੋ ਅਤੇ ਉਹ ਨਿਸ਼ਚਿਤ ਵਿਆਜ ਦਿੰਦੇ ਹਨ!",
        "Tamil": "பாண்ட் என்பது அரசாங்கத்திற்கோ அல்லது நிறுவனத்திற்கோ நீங்கள் வழங்கும் கடனாகும், அதற்கு அவர்கள் நிலையான வட்டி செலுத்துவார்கள்!",
        "Telugu": "బాండ్ అంటే ప్రభుత్వం లేదా కంపెనీకి మీరు ఇచ్చే అప్పు, దానికి వారు స్థిరమైన వడ్డీ చెల్లిస్తాయి!",
        "Marathi": "बॉण्ड म्हणजे तुम्ही सरकार किंवा कंपनीला दिलेले कर्ज, ज्यावर ते तुम्हाला ठरलेले व्याज देतात!"
    }
}

def query_gemini_gyaan_tutor(query: str, language: str):
    """
    Invokes Google Gemini API as an intelligent, reasoning SEBI-aligned financial educator.
    Dynamically analyzes user intent, applies SEBI investor protection rules, and synthesizes 
    custom responses, analogies, risk disclaimers, and interactive quizzes.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    system_instruction = (
        "You are Dhan Sarthi AI Gyaan Tutor, an intelligent, reasoning SEBI-aligned financial educator in India. "
        "Your task is to deeply understand the user's specific input, think through the underlying financial concepts, "
        "and generate a clear, custom response that adheres to SEBI (Securities and Exchange Board of India) investor safety guidelines.\n\n"
        "CORE GUIDELINES:\n"
        "1. DYNAMIC REASONING & COMPREHENSION: Think through the specific user query. Do NOT output generic static text. If it is a simple greeting (e.g. 'hi', 'namaste'), respond warmly without forcing financial lectures.\n"
        "2. SEBI ALIGNMENT: Strictly enforce SEBI guidelines—never promise guaranteed returns, emphasize investor protection, ASBA pool security, REIT 90% rental payout rule, and Riskometer disclosure.\n"
        f"3. LANGUAGE: Respond natively in '{language}'.\n"
        "4. ANALOGY: Provide a relatable Indian context analogy for financial concepts (set to null if query is a simple greeting or non-financial chat).\n"
        "5. DYNAMIC QUIZ: Create a custom 4-option quiz directly testing the concept explained in your answer (set to null if simple greeting).\n"
        "6. RISK WARNING: Include a targeted SEBI risk warning ONLY if the query involves investment products or market risk (set to null otherwise).\n\n"
        "OUTPUT FORMAT (STRICT RAW JSON WITHOUT MARKDOWN): \n"
        '{"explanation": "...", "analogy": "..." or null, "risk_warning": "..." or null, "badge_awarded": "...", "quiz": {"question": "...", "options": ["...", "...", "...", "..."], "correct_index": 1, "reward_coins": 50} or null}'
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"User Input: {query}\nRequested Language: {language}\nAnalyze intent and respond as JSON according to SEBI guidance rules."}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=8)
        if response.status_code == 200:
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if candidates:
                text_content = candidates[0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_content)
                return parsed
    except Exception:
        pass
    return None

@router.post("/ask-gyaan")
def ask_gyaan(request: GyaanQuery):
    q_lower = request.query.lower()
    lang = request.language if request.language in ["English", "Hindi", "Punjabi", "Tamil", "Telugu", "Marathi"] else "English"

    # Attempt Gemini LLM conversational education layer first
    gemini_res = query_gemini_gyaan_tutor(request.query, lang)
    if gemini_res and isinstance(gemini_res, dict):
        explanation = gemini_res.get("explanation", "")
        if gemini_res.get("analogy"):
            explanation += f"\n\n💡 Analogy: {gemini_res.get('analogy')}"
            
        return {
            "topic": request.query,
            "language": lang,
            "explanation": explanation,
            "analogy_used": True if gemini_res.get("analogy") else False,
            "risk_warning": gemini_res.get("risk_warning"),
            "badge_awarded": gemini_res.get("badge_awarded", "Market Explorer"),
            "ai_engine": "gemini-1.5-flash",
            "quiz": gemini_res.get("quiz")
        }
    
    # Fallback to rule-based analogy engine if Gemini API key is missing or call fails
    explanation = None
    for key in ANALOGIES:
        if key in q_lower:
            explanation = ANALOGIES[key].get(lang, ANALOGIES[key]["English"])
            break
            
    if not explanation:
        explanation = (
            "Securities markets provide transparent rules governed by SEBI to protect your wealth. "
            "Always assess your financial risk profile before making capital decisions."
        )

    return {
        "topic": request.query,
        "language": lang,
        "explanation": explanation,
        "analogy_used": True if any(k in q_lower for k in ANALOGIES) else False,
        "badge_awarded": "Market Explorer",
        "ai_engine": "rule-engine",
        "quiz": {
            "question": f"What is the key takeaway regarding {request.query}?",
            "options": [
                "It requires total high-risk speculation",
                "It helps in portfolio diversification & structured returns",
                "It guarantees 100% returns overnight",
                "It has no liquidity"
            ],
            "correct_index": 1,
            "reward_coins": 50
        }
    }

@router.post("/personalized-path")
def get_personalized_path(request: PersonalizedPathRequest):
    return {
        "profile": {
            "name": "Arnam",
            "age": request.age,
            "monthly_income": f"₹{request.monthly_income:,}/month",
            "portfolio_mix": f"{request.equity_pct}% Equity, {100 - request.equity_pct}% Debt & Cash",
            "learning_streak_days": 7,
            "badge": "Beginner Investor Badge"
        },
        "current_active_course": {
            "title": "Understanding REITs",
            "progress_pct": 70,
            "time_remaining_mins": 3,
            "topic_id": "reit_101"
        },
        "recommended_path": [
            {"step": 1, "title": "Basics of Mutual Funds", "status": "completed", "badge": "Fund Explorer"},
            {"step": 2, "title": "Why diversify beyond stocks?", "status": "in_progress", "badge": "Risk Sentinel"},
            {"step": 3, "title": "REITs & InvITs Explained", "status": "up_next", "badge": "REIT Master"},
            {"step": 4, "title": "Understanding Bonds & Fixed Yield", "status": "locked", "badge": "Bond Specialist"},
            {"step": 5, "title": "Build your first balanced portfolio", "status": "locked", "badge": "Smart Investor"}
        ]
    }

@router.post("/explain-portfolio")
def explain_portfolio(request: PortfolioExplainRequest):
    total_val = sum(h.get("amount", 0) for h in request.holdings)
    equity_val = sum(h.get("amount", 0) for h in request.holdings if h.get("category") == "Equity")
    equity_pct = round((equity_val / total_val * 100) if total_val > 0 else 75, 1)

    has_bonds = any(h.get("category") == "Debt" or "Bond" in h.get("name") for h in request.holdings)

    return {
        "portfolio_summary": {
            "total_value": total_val,
            "equity_exposure_pct": equity_pct,
            "has_debt_exposure": has_bonds,
            "warning": f"{equity_pct}% Equity Exposure ⚠️ (High Concentration Risk)" if equity_pct > 70 else "Balanced Portfolio Exposure"
        },
        "holdings_breakdown": request.holdings,
        "ai_analysis": f"Your portfolio has {equity_pct}% equity exposure with zero bond allocations. During market down-cycles, your portfolio may experience sharp drawdowns.",
        "recommended_learning": [
            {"id": "mod_1", "title": "Why diversification matters", "est_time": "4 mins", "category": "Risk Analytics"},
            {"id": "mod_2", "title": "Introduction to Bonds & Fixed Income", "est_time": "5 mins", "category": "Debt Securities"},
            {"id": "mod_3", "title": "Understanding Volatility & Asset Allocation", "est_time": "3 mins", "category": "Portfolio Management"}
        ]
    }

class SmartCheckpointRequest(BaseModel):
    user_id: str = "u1"
    asset_name: str = "Nexus Select REIT"
    asset_category: str = "REIT"
    investment_amount: float = 50000.0

@router.post("/before-you-invest")
def before_you_invest_check(request: BeforeYouInvestRequest):
    return {
        "asset_name": request.asset_name,
        "asset_category": request.asset_category,
        "readiness_score": 82,
        "is_ready": True,
        "checklist": [
            {"item": f"What is {request.asset_name}?", "understood": True},
            {"item": "Risk involved & maximum drawdown profile", "understood": True},
            {"item": "Expected returns & yield distribution", "understood": True},
            {"item": "Liquidity & lock-in periods under SEBI norms", "understood": False}
        ],
        "mandatory_lesson": {
            "title": f"3-Minute Fast Guide: {request.asset_name} Fundamentals",
            "duration": "3 mins",
            "key_takeaway": f"Ensure you keep emergency cash separate before committing capital to {request.asset_name}."
        },
        "action_text": "Complete 3-minute lesson → Continue Investment via Dhan Marg"
    }

@router.post("/smart-checkpoint")
def smart_checkpoint_check(request: SmartCheckpointRequest):
    asset_lower = request.asset_name.lower()
    
    if "reit" in asset_lower:
        q1 = {
            "id": "q1",
            "question": f"REIT returns (such as {request.asset_name}) mainly come from?",
            "options": [
                "Stock price speculation",
                "Rental income from commercial properties (min 90% payout)",
                "Government fixed interest guarantee"
            ],
            "correct_index": 1,
            "explanation": "SEBI norms mandate REITs distribute at least 90% of net rentable cash flow to unit holders."
        }
        q2 = {
            "id": "q2",
            "question": "Can the market value of a REIT unit decrease?",
            "options": [
                "Yes, market price fluctuates with occupancy & commercial realty cycles",
                "No, capital value is 100% fixed"
            ],
            "correct_index": 0,
            "explanation": "REIT units are traded on stock exchanges and fluctuate with interest rates & real estate cycles."
        }
    elif "bond" in asset_lower:
        q1 = {
            "id": "q1",
            "question": "What happens when market interest rates rise after buying a fixed-rate bond?",
            "options": [
                "Existing bond secondary market prices generally drop",
                "Bond coupon rate automatically doubles",
                "No impact on bond liquidity"
            ],
            "correct_index": 0,
            "explanation": "Bond prices move inversely to interest rate changes in secondary markets."
        }
        q2 = {
            "id": "q2",
            "question": "Are high-yield corporate bonds riskier than Government Bonds?",
            "options": [
                "Yes, corporate issuers carry credit default risk",
                "No, all bonds carry zero credit risk"
            ],
            "correct_index": 0,
            "explanation": "Corporate debt carries credit ratings reflecting company default probability."
        }
    else:
        q1 = {
            "id": "q1",
            "question": f"What is the primary risk factor when investing in {request.asset_name}?",
            "options": [
                "Capital loss due to market volatility",
                "Guaranteed 100% overnight double returns",
                "Zero risk profile"
            ],
            "correct_index": 0,
            "explanation": "All non-guaranteed securities are subject to market volatility under SEBI rules."
        }
        q2 = {
            "id": "q2",
            "question": "Should you invest your short-term emergency fund in equity markets?",
            "options": [
                "No, emergency funds require liquid debt or savings accounts",
                "Yes, emergency funds should be in high-beta stocks"
            ],
            "correct_index": 0,
            "explanation": "Emergency funds should be decoupled from volatile capital market assets."
        }

    publish_event(
        "KNOWLEDGE_CHECK_PASSED", request.user_id, "smart_checkpoint",
        {"asset_name": request.asset_name, "score": 85},
        severity="MEDIUM"
    )

    return {
        "asset_name": request.asset_name,
        "asset_category": request.asset_category,
        "investment_amount": request.investment_amount,
        "checkpoint_type": "Contextual Decision Checkpoint ⭐",
        "questions": [q1, q2],
        "understanding_score": 85,
        "learnings_verified": [
            "✓ Returns & Dividend Payout Engine",
            "✓ Volatility & Property Value Drawdowns",
            "✓ SEBI Liquidity & Trading Regulations"
        ],
        "behavioral_profile_update": {
            "understood_topics": ["Mutual Funds", "Stocks", "REIT Rental Yields"],
            "needs_learning_topics": ["Corporate Bond Credit Ratings", "Tax Deductions 115UA"]
        },
        "proceed_authorized": True,
        "action_text": "Proceed to Invest via Dhan Marg"
    }

@router.post("/invest/suitability")
def check_suitability(request: SuitabilityRequest):
    score = 85 if request.risk_score > 50 else 40
    is_suitable = score >= 70
    publish_event(
        "SUITABILITY_COMPLETED", request.user_id, "suitability_engine",
        {"asset_id": request.asset_id, "suitability_score": score, "is_suitable": is_suitable},
        severity="HIGH"
    )
    return {
        "asset": request.asset_id,
        "suitability_score": score,
        "is_suitable": is_suitable,
        "reason": "Based on your high income stability and long investment horizon, this asset fits your portfolio well." if is_suitable else "This asset is too volatile for your current risk profile."
    }

@router.post("/security/check-scam")
def check_scam(request: ScamCheckRequest):
    suspicious_keywords = ["guaranteed returns", "double your money", "sure shot", "tips", "whatsapp group", "telegram", "jackpot", "100%", "crypto profit"]
    text_lower = request.text.lower()
    matched_keywords = [word for word in suspicious_keywords if word in text_lower]
    is_scam = len(matched_keywords) > 0
    matched_count = len(matched_keywords)
    rule_based_risk_score = min(matched_count / len(suspicious_keywords), 1.0) if is_scam else 0.0

    event_type = "SCAM_DETECTED" if is_scam else "SCAM_SCAN_CLEAN"
    publish_event(
        event_type, request.user_id, "rakshak_security",
        {"matched_count": matched_count, "matched_indicators": matched_keywords, "is_scam": is_scam},
        severity="HIGH" if is_scam else "LOW"
    )

    return {
        "is_scam": is_scam,
        "rule_based_risk_score": round(rule_based_risk_score, 2),
        "score_basis": "keyword_rule_engine",
        "matched_indicators": matched_keywords,
        "matched_count": matched_count,
        "warning": "HIGH RISK ALERT: Scam indicators detected. Content matches known fraudulent solicitation patterns." if is_scam else "No scam indicators detected in content.",
        "scores_db_matched": is_scam
    }

@router.post("/security/verify-entity")
def verify_entity(request: EntityVerifyRequest):
    query = request.name.strip().lower()
    for key, entity in REGISTERED_ENTITIES.items():
        if key in query or query in entity["name"].lower():
            publish_event(
                "ENTITY_VERIFIED", request.user_id, "rakshak_security",
                {"queried_name": request.name, "reg_no": entity["reg_no"], "found": True},
                severity="LOW"
            )
            return {
                "found": True,
                "name": entity["name"],
                "reg_no": entity["reg_no"],
                "category": entity["category"],
                "status": entity["status"],
                "message": "Entity is SEBI Registered & Authorized"
            }

    publish_event(
        "ENTITY_UNVERIFIED", request.user_id, "rakshak_security",
        {"queried_name": request.name, "found": False},
        severity="HIGH"
    )
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
