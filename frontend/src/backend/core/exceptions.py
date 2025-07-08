"""
Red.AI Backend - Exception Handlers
Централизованная обработка исключений и ошибок
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from typing import Union

logger = logging.getLogger(__name__)

class RedAIException(Exception):
    """Базовое исключение для Red.AI"""
    def __init__(self, message: str, error_code: str = "REDAI_ERROR"):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)

class AIServiceException(RedAIException):
    """Исключение для AI сервисов"""
    def __init__(self, message: str, service: str):
        super().__init__(message, "AI_SERVICE_ERROR")
        self.service = service

class DatabaseException(RedAIException):
    """Исключение для работы с базой данных"""
    def __init__(self, message: str):
        super().__init__(message, "DATABASE_ERROR")

class AuthenticationException(RedAIException):
    """Исключение для аутентификации"""
    def __init__(self, message: str):
        super().__init__(message, "AUTH_ERROR")

class ValidationException(RedAIException):
    """Исключение для валидации данных"""
    def __init__(self, message: str, field: str = None):
        super().__init__(message, "VALIDATION_ERROR")
        self.field = field

async def redai_exception_handler(request: Request, exc: RedAIException):
    """Обработчик для пользовательских исключений Red.AI"""
    logger.error(f"Red.AI Exception: {exc.error_code} - {exc.message}")
    
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "type": "RedAIException"
            }
        }
    )

async def ai_service_exception_handler(request: Request, exc: AIServiceException):
    """Обработчик для исключений AI сервисов"""
    logger.error(f"AI Service Exception ({exc.service}): {exc.message}")
    
    return JSONResponse(
        status_code=502,
        content={
            "error": {
                "code": exc.error_code,
                "message": f"AI service error: {exc.message}",
                "service": exc.service,
                "type": "AIServiceException"
            }
        }
    )

async def database_exception_handler(request: Request, exc: DatabaseException):
    """Обработчик для исключений базы данных"""
    logger.error(f"Database Exception: {exc.message}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": exc.error_code,
                "message": "Database error occurred",
                "type": "DatabaseException"
            }
        }
    )

async def auth_exception_handler(request: Request, exc: AuthenticationException):
    """Обработчик для исключений аутентификации"""
    logger.warning(f"Authentication Exception: {exc.message}")
    
    return JSONResponse(
        status_code=401,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "type": "AuthenticationException"
            }
        }
    )

async def validation_exception_handler(request: Request, exc: ValidationException):
    """Обработчик для исключений валидации"""
    logger.warning(f"Validation Exception: {exc.message}")
    
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "field": exc.field,
                "type": "ValidationException"
            }
        }
    )

async def http_exception_handler(request: Request, exc: Union[HTTPException, StarletteHTTPException]):
    """Обработчик для HTTP исключений"""
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail,
                "type": "HTTPException"
            }
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Обработчик для всех остальных исключений"""
    logger.error(f"Unexpected Exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                "type": "InternalServerError"
            }
        }
    )

def setup_exception_handlers(app: FastAPI) -> None:
    """Настройка всех обработчиков исключений"""
    
    # Пользовательские исключения
    app.add_exception_handler(RedAIException, redai_exception_handler)
    app.add_exception_handler(AIServiceException, ai_service_exception_handler)
    app.add_exception_handler(DatabaseException, database_exception_handler)
    app.add_exception_handler(AuthenticationException, auth_exception_handler)
    app.add_exception_handler(ValidationException, validation_exception_handler)
    
    # HTTP исключения
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    
    # Общий обработчик
    app.add_exception_handler(Exception, general_exception_handler)
    
    logger.info("✅ Exception handlers configured successfully") 