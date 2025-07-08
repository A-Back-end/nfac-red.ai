"""
Red.AI Backend - Authentication Endpoints
Endpoint'ы для регистрации, входа и управления токенами
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from typing import Optional

from src.backend.core.database import get_async_db
from src.backend.core.config import settings
from src.backend.core.exceptions import AuthenticationException, ValidationException
from src.backend.models.user import User
from src.backend.schemas.auth import (
    UserCreate,
    UserLogin,
    Token,
    TokenData,
    UserResponse
)
from src.backend.services.auth_service import AuthService
from src.backend.services.user_service import UserService

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Регистрация нового пользователя
    
    - **email**: Email пользователя (уникальный)
    - **password**: Пароль (минимум 8 символов)
    - **name**: Имя пользователя
    """
    try:
        # Проверка существования пользователя
        user_service = UserService(db)
        existing_user = await user_service.get_user_by_email(user_data.email)
        
        if existing_user:
            raise ValidationException(
                message="User with this email already exists",
                field="email"
            )
        
        # Создание пользователя
        user = await user_service.create_user(user_data)
        
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            is_active=user.is_active,
            created_at=user.created_at
        )
        
    except ValidationException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Вход пользователя в систему
    
    - **email**: Email пользователя
    - **password**: Пароль пользователя
    
    Возвращает access token для авторизации
    """
    try:
        auth_service = AuthService(db)
        user = await auth_service.authenticate_user(login_data.email, login_data.password)
        
        if not user:
            raise AuthenticationException("Invalid email or password")
        
        if not user.is_active:
            raise AuthenticationException("User account is disabled")
        
        # Создание токена
        access_token = auth_service.create_access_token(
            data={"sub": user.email, "user_id": user.id}
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except AuthenticationException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Получение информации о текущем пользователе
    
    Требует авторизации через Bearer token
    """
    try:
        auth_service = AuthService(db)
        user = await auth_service.get_current_user(credentials.credentials)
        
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            is_active=user.is_active,
            created_at=user.created_at
        )
        
    except AuthenticationException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user information"
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Обновление access token
    
    Требует валидный токен
    """
    try:
        auth_service = AuthService(db)
        user = await auth_service.get_current_user(credentials.credentials)
        
        # Создание нового токена
        new_token = auth_service.create_access_token(
            data={"sub": user.email, "user_id": user.id}
        )
        
        return Token(
            access_token=new_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except AuthenticationException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Выход из системы
    
    Инвалидирует текущий токен
    """
    try:
        auth_service = AuthService(db)
        await auth_service.logout_user(credentials.credentials)
        
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        ) 