"""API routes for URL scanning operations.

Provides REST endpoints for:
- Health check
- URL analysis
- History management
- Statistics
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.scan import (
    URLInput,
    ScanResult,
    DeleteResponse,
    ScanListResponse,
    StatisticsResponse,
)
from app.services.scan_service import ScanService
from app.utils.logger import app_logger

router = APIRouter()


def get_scan_service(db: Session = Depends(get_db)) -> ScanService:
    """Dependency to get ScanService instance."""
    return ScanService(db)


@router.post(
    "/analyze",
    response_model=ScanResult,
    status_code=status.HTTP_200_OK,
    summary="Analyze a URL",
    description="Analyze a URL for phishing indicators and get risk assessment",
)
async def analyze_url(
    url_input: URLInput,
    service: ScanService = Depends(get_scan_service),
):
    """Analyze a URL for phishing indicators."""
    try:
        # Convert HttpUrl to normal string
        url = str(url_input.url)

        app_logger.info(f"Analyzing URL: {url[:50]}...")

        result = service.analyze_url(url)

        return ScanResult(**result)

    except Exception as e:
        app_logger.error(f"Error analyzing URL: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze URL: {str(e)}",
        )


@router.get(
    "/history",
    response_model=ScanListResponse,
    summary="Get scan history",
    description="Retrieve paginated scan history with optional search",
)
async def get_history(
    search: Optional[str] = Query(None, description="Search URLs by keyword"),
    skip: int = Query(0, ge=0, description="Records to skip"),
    limit: int = Query(200, ge=1, le=1000, description="Records per page"),
    service: ScanService = Depends(get_scan_service),
):
    try:
        result = service.get_history(search=search, skip=skip, limit=limit)
        return ScanListResponse(**result)

    except Exception as e:
        app_logger.error(f"Error fetching history: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch history: {str(e)}",
        )


@router.delete(
    "/history/{record_id}",
    response_model=DeleteResponse,
)
async def delete_history_record(
    record_id: int,
    service: ScanService = Depends(get_scan_service),
):
    deleted = service.delete_history_record(record_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History record with ID {record_id} not found",
        )

    return DeleteResponse(
        message="Record deleted successfully",
        deleted_id=record_id,
    )


@router.delete(
    "/history",
    response_model=DeleteResponse,
)
async def clear_history(
    service: ScanService = Depends(get_scan_service),
):
    count = service.clear_all_history()

    return DeleteResponse(
        message=f"All history cleared. Deleted {count} records.",
    )


@router.get(
    "/stats",
    response_model=StatisticsResponse,
)
async def get_statistics(
    service: ScanService = Depends(get_scan_service),
):
    try:
        stats = service.get_statistics()
        return StatisticsResponse(**stats)

    except Exception as e:
        app_logger.error(f"Error fetching statistics: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch statistics: {str(e)}",
        )