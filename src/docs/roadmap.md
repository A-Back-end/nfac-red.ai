# Red.AI Project Roadmap

## 🎯 Цель проекта
Создать полнофункциональную AI-платформу для дизайна интерьеров с использованием генеративных моделей и 3D-визуализации.

## 📋 Этапы разработки

### Phase 1: Архитектура и базовая структура ✅
**Срок:** 1-2 недели  
**Статус:** В процессе

- [x] Создание структуры каталогов
- [x] Настройка Docker окружения
- [x] Базовый UI с Tailwind + React
- [ ] Настройка базы данных (Supabase/PostgreSQL)
- [ ] Базовые API endpoints
- [ ] Система аутентификации

### Phase 2: Генерация изображений и AI интеграции
**Срок:** 2-3 недели  
**Статус:** Не начат

- [ ] Интеграция OpenAI DALL-E
- [ ] Fallback на Hugging Face
- [ ] Система промптов для дизайна
- [ ] Загрузка и обработка изображений
- [ ] Анализ помещений (комнат)

### Phase 3: Дашборд и пользовательский интерфейс
**Срок:** 2-3 недели  
**Статус:** Не начат

- [ ] Дашборд для проектов
- [ ] Менеджер сохраненных дизайнов
- [ ] Чат-интерфейс для AI консультаций
- [ ] Настройки профиля
- [ ] Система токенов/лимитов

### Phase 4: 3D визуализация и расширенные функции
**Срок:** 3-4 недели  
**Статус:** Не начат

- [ ] 3D просмотрщик (Three.js)
- [ ] Интеграция с Blender
- [ ] Экспорт в PDF/изображения
- [ ] Pinterest интеграция для идей
- [ ] Система рекомендаций

### Phase 5: Тестирование и деплой
**Срок:** 1-2 недели  
**Статус:** Не начат

- [ ] Unit тесты для backend
- [ ] Integration тесты для API
- [ ] E2E тесты для UI
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Production деплой (Railway/Vercel)

## 🛠 Технологический стек

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **3D Graphics:** Three.js
- **Testing:** Jest + React Testing Library

### Backend  
- **Framework:** FastAPI (Python)
- **Database:** Supabase/PostgreSQL
- **ORM:** Prisma/SQLAlchemy
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage

### AI Models
- **Image Generation:** OpenAI DALL-E 3
- **Fallback:** Hugging Face Diffusion
- **Chat:** OpenAI GPT-4
- **Image Analysis:** OpenAI Vision API

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Deployment:** Railway (backend) + Vercel (frontend)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry

## 📊 Прогресс

```
Общий прогресс: [████████░░] 30%

Phase 1: [████████░░] 60%
Phase 2: [░░░░░░░░░░] 0%
Phase 3: [░░░░░░░░░░] 0%
Phase 4: [░░░░░░░░░░] 0%
Phase 5: [░░░░░░░░░░] 0%
```

## 🔗 Важные ссылки

- [API Documentation](./api-docs.md)
- [Frontend Architecture](./frontend-architecture.md)
- [Database Schema](./database-schema.md)
- [Deployment Guide](../DEPLOYMENT.md)

## 📝 Заметки

- Все API ключи хранятся в `.env` файлах
- Используем черновую версию для быстрой итерации
- Тестируем каждый endpoint через Postman/curl
- Документация генерируется автоматически

**Последнее обновление:** $(date) 