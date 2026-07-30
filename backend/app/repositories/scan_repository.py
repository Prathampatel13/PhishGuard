"""Repository layer for ScanHistory database operations.

Provides CRUD operations and query methods for scan history records.
"""

import json
from datetime import datetime, timedelta
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.models.scan_history import ScanHistory
from app.utils.logger import app_logger


class ScanRepository:
    """Repository for managing scan history records."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, scan_data: dict) -> ScanHistory:
        """Create a new scan history record.

        Args:
            scan_data: Dictionary containing scan result data

        Returns:
            Created ScanHistory instance
        """
        scan = ScanHistory(**scan_data)
        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)
        app_logger.info(f"Created scan record for URL: {scan.url[:50]}...")
        return scan

    def get_by_id(self, scan_id: int) -> Optional[ScanHistory]:
        """Get a scan record by ID.

        Args:
            scan_id: ID of the scan record

        Returns:
            ScanHistory instance or None
        """
        return self.db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()

    def get_all(
        self,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Tuple[List[ScanHistory], int]:
        """Get all scan records with optional search and pagination.

        Args:
            search: Optional URL search term
            skip: Number of records to skip
            limit: Maximum records to return

        Returns:
            Tuple of (list of records, total count)
        """
        query = self.db.query(ScanHistory)

        if search:
            search_term = f"%{search}%"
            query = query.filter(ScanHistory.url.ilike(search_term))

        total = query.count()
        records = (
            query.order_by(desc(ScanHistory.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

        return records, total

    def delete(self, scan_id: int) -> bool:
        """Delete a scan record by ID.

        Args:
            scan_id: ID of the scan record to delete

        Returns:
            True if deleted, False if not found
        """
        scan = self.get_by_id(scan_id)
        if scan:
            self.db.delete(scan)
            self.db.commit()
            app_logger.info(f"Deleted scan record ID: {scan_id}")
            return True
        return False

    def clear_all(self) -> int:
        """Delete all scan records.

        Returns:
            Number of deleted records
        """
        count = self.db.query(ScanHistory).delete()
        self.db.commit()
        app_logger.info(f"Cleared all scan records. Deleted: {count}")
        return count

    def get_statistics(self) -> dict:
        """Get aggregate statistics about scan records.

        Returns:
            Dictionary containing statistics
        """
        total = self.db.query(ScanHistory).count()
        safe = self.db.query(ScanHistory).filter(ScanHistory.status == "safe").count()
        suspicious = (
            self.db.query(ScanHistory)
            .filter(ScanHistory.status == "suspicious")
            .count()
        )
        dangerous = (
            self.db.query(ScanHistory)
            .filter(ScanHistory.status == "dangerous")
            .count()
        )

        avg_risk = (
            self.db.query(func.avg(ScanHistory.risk_score)).scalar() or 0.0
        )

        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_scans = (
            self.db.query(ScanHistory)
            .filter(ScanHistory.created_at >= today_start)
            .count()
        )

        # Calculate percentages
        safe_pct = (safe / total * 100) if total > 0 else 0
        suspicious_pct = (suspicious / total * 100) if total > 0 else 0
        dangerous_pct = (dangerous / total * 100) if total > 0 else 0

        # Daily scan counts (last 7 days)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        daily_counts = (
            self.db.query(
            func.date(ScanHistory.created_at).label("date"),
            func.count(ScanHistory.id).label("count"),
    )
    .filter(ScanHistory.created_at >= seven_days_ago)
    .group_by(func.date(ScanHistory.created_at))
    .order_by(func.date(ScanHistory.created_at))
    .all()
)

        daily_scan_counts = [
            {"date": str(row.date), "count": row.count} for row in daily_counts
        ]

        # Risk trend (last 7 days average risk score per day)
        risk_trend_data = (
            self.db.query(
                func.date(ScanHistory.created_at).label("date"),
                func.avg(ScanHistory.risk_score).label("avg_risk"),
        )
        .filter(ScanHistory.created_at >= seven_days_ago)
        .group_by(func.date(ScanHistory.created_at))
        .order_by(func.date(ScanHistory.created_at))
        .all()
        )

        risk_trend = [
            {"date": str(row.date), "avg_risk": round(float(row.avg_risk), 2)}
            for row in risk_trend_data
        ]

        return {
            "total_scans": total,
            "safe_count": safe,
            "suspicious_count": suspicious,
            "dangerous_count": dangerous,
            "average_risk_score": round(float(avg_risk), 2),
            "today_scans": today_scans,
            "safe_percentage": round(safe_pct, 1),
            "suspicious_percentage": round(suspicious_pct, 1),
            "dangerous_percentage": round(dangerous_pct, 1),
            "daily_scan_counts": daily_scan_counts,
            "risk_trend": risk_trend,
        }

