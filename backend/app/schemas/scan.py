"""Pydantic schemas for request/response validation."""

from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime


class URLInput(BaseModel):
    """Schema for URL analysis request."""

    url: HttpUrl = Field(
        ...,
        description="URL to analyze (must include http:// or https://)",
    )


class AnalysisDetails(BaseModel):
    """Detailed analysis breakdown."""

    has_https: bool = False
    has_http: bool = False
    url_length: int = 0
    has_hyphens: bool = False
    has_at_symbol: bool = False
    has_ip: bool = False
    subdomain_count: int = 0
    dot_count: int = 0
    special_char_count: int = 0
    number_count: int = 0
    suspicious_keywords: List[str] = []
    brand_impersonation: List[str] = []
    suspicious_tld: bool = False


class ScanResult(BaseModel):
    """Schema for scan analysis result."""

    url: str
    risk_score: float
    status: str
    reasons: List[str]
    recommendation: str
    confidence: float
    analysis_details: AnalysisDetails


class ScanHistoryResponse(BaseModel):
    """Schema for scan history response."""

    id: int
    url: str
    risk_score: float
    status: str
    reasons: Optional[str] = None
    recommendation: Optional[str] = None
    confidence: float
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class ScanListResponse(BaseModel):
    """Schema for list of scan history records."""

    total: int
    records: List[ScanHistoryResponse]
    page: int
    limit: int


class StatisticsResponse(BaseModel):
    """Schema for dashboard statistics."""

    total_scans: int = 0
    safe_count: int = 0
    suspicious_count: int = 0
    dangerous_count: int = 0
    average_risk_score: float = 0.0
    today_scans: int = 0
    safe_percentage: float = 0.0
    suspicious_percentage: float = 0.0
    dangerous_percentage: float = 0.0
    daily_scan_counts: List[dict] = []
    risk_trend: List[dict] = []


class HealthResponse(BaseModel):
    """Schema for health check response."""

    status: str
    app: str
    version: str


class DeleteResponse(BaseModel):
    """Schema for delete response."""

    message: str
    deleted_id: Optional[int] = None