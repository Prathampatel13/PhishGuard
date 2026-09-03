"""PhishGuard - Phishing URL Detection System

Main FastAPI application entry point.
Configures middleware, routers, and startup events.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import init_database
from app.routes.scan import router as scan_router
from app.utils.logger import app_logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler.

    Initializes database on startup and performs cleanup on shutdown.
    """
    app_logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    app_logger.info("Initializing database...")
    init_database()
    app_logger.info("Database initialized successfully")
    yield
    app_logger.info(f"Shutting down {settings.APP_NAME}")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions."""
    app_logger.error(
        f"Unhandled exception: {str(exc)}",
        exc_info=True,
        extra={"path": request.url.path},
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred. Please try again later.",
            "path": request.url.path,
        },
    )


# Include routers
app.include_router(scan_router, tags=["URL Analysis"])


@app.get("/api/health")
async def api_health():
    """API health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "endpoints": {
            "analyze": "POST /analyze",
            "history": "GET /history",
            "stats": "GET /stats",
            "docs": "GET /docs",
        },
    }


# Root redirect to API docs
@app.get("/")
async def root():
    """Root endpoint - redirects to API documentation."""
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "documentation": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL.lower(),
    )

