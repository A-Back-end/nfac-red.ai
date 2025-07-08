"""
Red.AI Backend - Database Configuration
Настройка подключения к базе данных PostgreSQL + Redis
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from databases import Database
import redis.asyncio as redis
from typing import AsyncGenerator
import logging

from src.backend.core.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
ASYNC_SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# Асинхронный движок
async_engine = create_async_engine(
    ASYNC_SQLALCHEMY_DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

# Синхронный движок (для миграций)
sync_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=settings.DEBUG
)

# Сессии
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=sync_engine
)

# Database instance для прямых запросов
database = Database(ASYNC_SQLALCHEMY_DATABASE_URL)

# Base class для моделей
Base = declarative_base()

# Redis connection
redis_client = None

async def init_db():
    """Инициализация базы данных"""
    global redis_client
    
    try:
        # Подключение к базе данных
        await database.connect()
        logger.info("✅ Database connected successfully")
        
        # Подключение к Redis
        redis_client = redis.from_url(settings.REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected successfully")
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise

async def close_db():
    """Закрытие подключений к базе данных"""
    global redis_client
    
    try:
        await database.disconnect()
        if redis_client:
            await redis_client.close()
        logger.info("✅ Database connections closed")
    except Exception as e:
        logger.error(f"❌ Error closing database connections: {e}")

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """Получение асинхронной сессии базы данных"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def get_sync_db():
    """Получение синхронной сессии базы данных"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_redis():
    """Получение Redis клиента"""
    return redis_client 