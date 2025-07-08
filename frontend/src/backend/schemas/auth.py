"""
Red.AI Backend - Authentication Schemas
Pydantic схемы для аутентификации и пользователей
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """Роли пользователей"""
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"

class UserCreate(BaseModel):
    """Схема для создания пользователя"""
    email: EmailStr = Field(..., description="Email пользователя")
    password: str = Field(..., min_length=8, description="Пароль (минимум 8 символов)")
    name: str = Field(..., min_length=2, max_length=100, description="Имя пользователя")
    
    @validator('password')
    def validate_password(cls, v):
        """Валидация пароля"""
        if len(v) < 8:
            raise ValueError('Пароль должен содержать минимум 8 символов')
        if not any(c.isupper() for c in v):
            raise ValueError('Пароль должен содержать хотя бы одну заглавную букву')
        if not any(c.islower() for c in v):
            raise ValueError('Пароль должен содержать хотя бы одну строчную букву')
        if not any(c.isdigit() for c in v):
            raise ValueError('Пароль должен содержать хотя бы одну цифру')
        return v

class UserLogin(BaseModel):
    """Схема для входа в систему"""
    email: EmailStr = Field(..., description="Email пользователя")
    password: str = Field(..., description="Пароль пользователя")

class UserResponse(BaseModel):
    """Схема для ответа с данными пользователя"""
    id: str = Field(..., description="ID пользователя")
    email: EmailStr = Field(..., description="Email пользователя")
    name: str = Field(..., description="Имя пользователя")
    role: UserRole = Field(..., description="Роль пользователя")
    is_active: bool = Field(..., description="Активен ли пользователь")
    is_verified: bool = Field(..., description="Подтвержден ли email")
    avatar: Optional[str] = Field(None, description="URL аватара")
    created_at: datetime = Field(..., description="Дата создания")
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Схема для обновления данных пользователя"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    website: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    language: Optional[str] = Field(None, max_length=10)
    timezone: Optional[str] = Field(None, max_length=50)
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None

class Token(BaseModel):
    """Схема для JWT токена"""
    access_token: str = Field(..., description="JWT токен")
    token_type: str = Field(default="bearer", description="Тип токена")
    expires_in: int = Field(..., description="Время жизни токена в секундах")

class TokenData(BaseModel):
    """Схема для данных из JWT токена"""
    email: Optional[str] = None
    user_id: Optional[str] = None
    
class RefreshToken(BaseModel):
    """Схема для обновления токена"""
    refresh_token: str = Field(..., description="Refresh токен")

class PasswordChange(BaseModel):
    """Схема для смены пароля"""
    current_password: str = Field(..., description="Текущий пароль")
    new_password: str = Field(..., min_length=8, description="Новый пароль")
    confirm_password: str = Field(..., description="Подтверждение нового пароля")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Пароли не совпадают')
        return v

class PasswordReset(BaseModel):
    """Схема для сброса пароля"""
    email: EmailStr = Field(..., description="Email для сброса пароля")

class PasswordResetConfirm(BaseModel):
    """Схема для подтверждения сброса пароля"""
    token: str = Field(..., description="Токен сброса пароля")
    new_password: str = Field(..., min_length=8, description="Новый пароль")
    confirm_password: str = Field(..., description="Подтверждение нового пароля")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Пароли не совпадают')
        return v

class EmailVerification(BaseModel):
    """Схема для подтверждения email"""
    token: str = Field(..., description="Токен подтверждения email")

class UserStats(BaseModel):
    """Схема для статистики пользователя"""
    total_projects: int = Field(..., description="Общее количество проектов")
    total_images_generated: int = Field(..., description="Общее количество сгенерированных изображений")
    total_ai_requests: int = Field(..., description="Общее количество AI запросов")
    subscription_status: str = Field(..., description="Статус подписки")
    subscription_ends_at: Optional[datetime] = Field(None, description="Окончание подписки")

class UserPreferences(BaseModel):
    """Схема для предпочтений пользователя"""
    favorite_styles: Optional[list] = Field(None, description="Любимые стили")
    preferred_colors: Optional[list] = Field(None, description="Предпочитаемые цвета")
    budget_range: Optional[str] = Field(None, description="Бюджетный диапазон")
    room_preferences: Optional[dict] = Field(None, description="Предпочтения по комнатам") 