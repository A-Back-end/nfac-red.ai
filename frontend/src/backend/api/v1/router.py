"""
Red.AI Backend - Main API Router
Главный роутер для всех API endpoint'ов версии 1
"""
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer

from src.backend.api.v1.endpoints import (
    auth,
    users,
    projects,
    ai_services,
    files,
    rooms,
    designs
)

# Создание главного роутера
api_router = APIRouter()

# Security scheme
security = HTTPBearer()

# Подключение endpoint'ов
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden"},
    }
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(security)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    }
)

api_router.include_router(
    projects.router,
    prefix="/projects",
    tags=["Projects"],
    dependencies=[Depends(security)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
        status.HTTP_404_NOT_FOUND: {"description": "Project not found"},
    }
)

api_router.include_router(
    ai_services.router,
    prefix="/ai",
    tags=["AI Services"],
    dependencies=[Depends(security)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
        status.HTTP_502_BAD_GATEWAY: {"description": "AI Service Error"},
    }
)

api_router.include_router(
    files.router,
    prefix="/files",
    tags=["File Management"],
    dependencies=[Depends(security)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE: {"description": "File too large"},
    }
)

api_router.include_router(
    rooms.router,
    prefix="/rooms",
    tags=["Room Analysis"],
    dependencies=[Depends(security)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Invalid room data"},
    }
)

api_router.include_router(
    designs.router,
    prefix="/designs",
    tags=["Design Generation"],
    dependencies=[Depends(security)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
        status.HTTP_502_BAD_GATEWAY: {"description": "Design generation failed"},
    }
)

@api_router.get("/health", tags=["Health Check"])
async def health_check():
    """Проверка здоровья API"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "Red.AI Backend API"
    } 