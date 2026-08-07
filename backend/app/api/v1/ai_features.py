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
        "Telugu": "మ్యూచువల్ ఫండ్ అంటే అందరూ కలిసి డబ్బు వేసి ఒక నిపుణుడి ద్వారా పెట్టుబడి పెట్టడం!",
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

@router.post("/ask-gyaan")
def ask_gyaan(request: GyaanQuery):
    q_lower = request.query.lower()
    lang = request.language if request.language in ["English", "Hindi", "Punjabi", "Tamil", "Telugu", "Marathi"] else "English"
    
    explanation = None
    for key in ANALOGIES:
        if key in q_lower:
            explanation = ANALOGIES[key].get(lang, ANALOGIES[key]["English"])
            break
            
    if not explanation:
        explanation = (
            f"Here is your bite-sized 3-minute lesson on '{request.query}' in {lang}: "
            f"Securities markets provide transparent rules governed by SEBI to protect your wealth. "
            f"Always assess your financial risk profile before making capital decisions."
        )

    return {
        "topic": request.query,
        "language": lang,
        "explanation": explanation,
        "analogy_used": True if any(k in q_lower for k in ANALOGIES) else False,
        "badge_awarded": "Market Explorer",
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

