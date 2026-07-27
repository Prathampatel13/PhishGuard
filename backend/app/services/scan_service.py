"""Scan service - Business logic for URL scanning operations.

Bridges the analyzer engine with database operations.
"""

import json
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from app.services.analyzer import URLAnalyzer
from app.repositories.scan_repository import ScanRepository
from app.utils.logger import app_logger


class ScanService:
    """Service layer for URL scanning operations."""

    def __init__(self, db: Session):
        self.analyzer = URLAnalyzer()
        self.repository = ScanRepository(db)

    def analyze_url(self, url: str) -> dict:
        """Analyze a URL and save results to database.

        Args:
            url: The URL to analyze

        Returns:
            Dictionary containing analysis results
        """
        # Run the analysis
        result = self.analyzer.analyze(url)

        # Prepare data for database
        analysis = result["analysis_details"]
        db_data = {
            "url": result["url"],
            "risk_score": result["risk_score"],
            "status": result["status"],
            "reasons": json.dumps(result["reasons"]),
            "recommendation": result["recommendation"],
            "confidence": result["confidence"],
            "has_https": 1 if analysis["has_https"] else 0,
            "has_http": 1 if analysis["has_http"] else 0,
            "url_length": analysis["url_length"],
            "has_hyphens": 1 if analysis["has_hyphens"] else 0,
            "has_at_symbol": 1 if analysis["has_at_symbol"] else 0,
            "has_ip": 1 if analysis["has_ip"] else 0,
            "subdomain_count": analysis["subdomain_count"],
            "dot_count": analysis["dot_count"],
            "special_char_count": analysis["special_char_count"],
            "number_count": analysis["number_count"],
            "suspicious_keywords": json.dumps(analysis["suspicious_keywords"]),
            "brand_impersonation": json.dumps(analysis["brand_impersonation"]),
            "suspicious_tld": 1 if analysis["suspicious_tld"] else 0,
        }

        # Save to database
        scan_record = self.repository.create(db_data)

        app_logger.info(
            f"URL analyzed and saved: {url[:50]}... "
            f"Score: {result['risk_score']}, Status: {result['status']}"
        )

        # Add record ID to result
        result["id"] = scan_record.id
        result["created_at"] = scan_record.created_at.isoformat() if scan_record.created_at else None

        return result

    def get_history(
        self,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> dict:
        """Get scan history with pagination.

        Args:
            search: Optional search term for URLs
            skip: Number of records to skip
            limit: Maximum records to return

        Returns:
            Dictionary with records and total count
        """
        records, total = self.repository.get_all(
            search=search,
            skip=skip,
            limit=limit,
        )

        return {
            "total": total,
            "records": [record.to_dict() for record in records],
            "page": (skip // limit) + 1 if limit > 0 else 1,
            "limit": limit,
        }

    def get_history_record(self, record_id: int) -> Optional[dict]:
        """Get a single history record.

        Args:
            record_id: ID of the record

        Returns:
            Record dictionary or None
        """
        record = self.repository.get_by_id(record_id)
        return record.to_dict() if record else None

    def delete_history_record(self, record_id: int) -> bool:
        """Delete a history record.

        Args:
            record_id: ID of the record to delete

        Returns:
            True if deleted, False if not found
        """
        return self.repository.delete(record_id)

    def clear_all_history(self) -> int:
        """Clear all history records.

        Returns:
            Number of deleted records
        """
        count = self.repository.clear_all()
        app_logger.info(f"All history cleared. Deleted {count} records.")
        return count

    def get_statistics(self) -> dict:
        """Get dashboard statistics.

        Returns:
            Dictionary containing statistics
        """
        return self.repository.get_statistics()

