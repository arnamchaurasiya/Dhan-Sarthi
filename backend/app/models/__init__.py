"""
Dhan Sarthi — SQLAlchemy Models Package
Imports all model classes so Base.metadata.create_all() picks up every table.
"""
from app.models.user import User, InvestorProfile, KYCRecord
from app.models.consent import Consent, FIP
from app.models.instrument import Instrument, ProductRiskMetrics
from app.models.portfolio import Account, Holding, Transaction, PortfolioSnapshot
from app.models.suitability import RiskProfile, SuitabilityAssessment, SuitabilityFactor
from app.models.safety import SafetyAlert, ScamScan, EntityVerification
from app.models.learning import LearningContent, LearningProgress
from app.models.order import Order, OrderEvent
from app.models.audit_model import AuditEventRecord

__all__ = [
    "User", "InvestorProfile", "KYCRecord",
    "Consent", "FIP",
    "Instrument", "ProductRiskMetrics",
    "Account", "Holding", "Transaction", "PortfolioSnapshot",
    "RiskProfile", "SuitabilityAssessment", "SuitabilityFactor",
    "SafetyAlert", "ScamScan", "EntityVerification",
    "LearningContent", "LearningProgress",
    "Order", "OrderEvent",
    "AuditEventRecord",
]
