"""
Red.AI Database - User Model
Модель пользователя для системы
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from src.backend.core.database import Base

class UserRole(enum.Enum):
    """Роли пользователей"""
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"

class SubscriptionStatus(enum.Enum):
    """Статусы подписки"""
    FREE = "free"
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

class User(Base):
    """Модель пользователя"""
    __tablename__ = "users"
    
    # Основные поля
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    
    # Статусы
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    # Подписка
    subscription_status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.FREE)
    subscription_ends_at = Column(DateTime(timezone=True), nullable=True)
    
    # Профиль
    avatar = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # Настройки
    language = Column(String(10), default="en")
    timezone = Column(String(50), default="UTC")
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    
    # Статистика
    total_projects = Column(Integer, default=0)
    total_images_generated = Column(Integer, default=0)
    total_ai_requests = Column(Integer, default=0)
    
    # Даты
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    
    # Связи
    projects = relationship("Project", back_populates="owner", lazy="dynamic")
    generations = relationship("ImageGeneration", back_populates="user", lazy="dynamic")
    api_keys = relationship("APIKey", back_populates="user", lazy="dynamic")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"
    
    @property
    def is_premium(self) -> bool:
        """Проверка премиум статуса"""
        return self.role in [UserRole.PREMIUM, UserRole.ADMIN]
    
    @property
    def has_active_subscription(self) -> bool:
        """Проверка активной подписки"""
        if self.subscription_status == SubscriptionStatus.ACTIVE:
            if self.subscription_ends_at:
                from datetime import datetime, timezone
                return datetime.now(timezone.utc) < self.subscription_ends_at
            return True
        return False
    
    def to_dict(self) -> dict:
        """Преобразование в словарь"""
        return {
            "id": str(self.id),
            "email": self.email,
            "name": self.name,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "role": self.role.value,
            "subscription_status": self.subscription_status.value,
            "avatar": self.avatar,
            "bio": self.bio,
            "website": self.website,
            "phone": self.phone,
            "language": self.language,
            "timezone": self.timezone,
            "total_projects": self.total_projects,
            "total_images_generated": self.total_images_generated,
            "total_ai_requests": self.total_ai_requests,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
        } 