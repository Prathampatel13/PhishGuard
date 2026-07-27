"""ScanHistory database model.

Stores all URL scan results including risk analysis details.
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Text, DateTime

from app.database import Base


class ScanHistory(Base):
    """Model representing a URL scan history record."""

    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    url = Column(String(2048), nullable=False, index=True)
    risk_score = Column(Float, nullable=False)
    status = Column(String(20), nullable=False)  # safe, suspicious, dangerous
    reasons = Column(Text, nullable=True)  # JSON-serialized list of reasons
    recommendation = Column(Text, nullable=True)
    confidence = Column(Float, nullable=False)

    # Detailed analysis fields
    has_https = Column(Integer, default=0)
    has_http = Column(Integer, default=0)
    url_length = Column(Integer, default=0)
    has_hyphens = Column(Integer, default=0)
    has_at_symbol = Column(Integer, default=0)
    has_ip = Column(Integer, default=0)
    subdomain_count = Column(Integer, default=0)
    dot_count = Column(Integer, default=0)
    special_char_count = Column(Integer, default=0)
    number_count = Column(Integer, default=0)
    suspicious_keywords = Column(Text, nullable=True)  # JSON-serialized list
    brand_impersonation = Column(Text, nullable=True)  # JSON-serialized list
    suspicious_tld = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "url": self.url,
            "risk_score": self.risk_score,
            "status": self.status,
            "reasons": self.reasons,
            "recommendation": self.recommendation,
            "confidence": self.confidence,
            "has_https": self.has_https,
            "has_http": self.has_http,
            "url_length": self.url_length,
            "has_hyphens": self.has_hyphens,
            "has_at_symbol": self.has_at_symbol,
            "has_ip": self.has_ip,
            "subdomain_count": self.subdomain_count,
            "dot_count": self.dot_count,
            "special_char_count": self.special_char_count,
            "number_count": self.number_count,
            "suspicious_keywords": self.suspicious_keywords,
            "brand_impersonation": self.brand_impersonation,
            "suspicious_tld": self.suspicious_tld,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

