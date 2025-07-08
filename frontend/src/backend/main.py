"""
Red.AI Backend - Main FastAPI Application
Архитектура: Модульная FastAPI с разделением на слои
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
from typing import AsyncGenerator

# Импорты наших модулей
from src.backend.core.config import settings
from src.backend.core.database import init_db
from src.backend.api.v1.router import api_router
from src.backend.core.middleware import setup_middleware
from src.backend.core.exceptions import setup_exception_handlers

# Логирование
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifecycle manager для FastAPI приложения"""
    logger.info("🚀 Starting Red.AI Backend...")
    
    # Инициализация базы данных
    await init_db()
    logger.info("✅ Database initialized")
    
    yield
    
    logger.info("🔄 Shutting down Red.AI Backend...")

# Создание FastAPI приложения
app = FastAPI(
    title="Red.AI Backend API",
    description="AI-powered interior design platform backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
    openapi_url="/api/openapi.json"
)

# Настройка middleware
setup_middleware(app)

# Настройка обработчиков исключений
setup_exception_handlers(app)

# Подключение роутеров
app.include_router(api_router, prefix="/api/v1")

# Статические файлы
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    """Главная страница API"""
    return {
        "message": "Red.AI Backend API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {"status": "healthy", "service": "red-ai-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    ) 