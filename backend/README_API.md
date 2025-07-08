# RED AI API - Дэшборд AI RED

## Новые API Endpoints для интерактивного дэшборда

### 📊 Статистика дэшборда

**GET /api/dashboard/stats**
- Получить общую статистику для дэшборда
- Возвращает: количество дизайнов, активных проектов, избранных клиентов, выполненных задач

```json
{
  "total_designs": 10,
  "active_projects": 3,
  "favorite_clients": 5,
  "daily_tasks_completed": 2,
  "weekly_interactions": 15
}
```

### ✅ Управление задачами

**GET /api/dashboard/tasks**
- Получить список ежедневных задач

**POST /api/dashboard/tasks**
- Создать новую задачу
```json
{
  "title": "Загрузить планировку квартиры",
  "description": "Анализ 3-комнатной квартиры для клиента",
  "target_date": "2024-01-15T10:00:00Z"
}
```

**PUT /api/dashboard/tasks/{task_id}**
- Обновить статус задачи
```json
{
  "is_completed": true
}
```

**DELETE /api/dashboard/tasks/{task_id}**
- Удалить задачу

### 👥 Управление клиентами

**GET /api/dashboard/clients**
- Получить список избранных клиентов

**POST /api/dashboard/clients**
- Добавить клиента в избранное
```json
{
  "name": "Анна Петрова",
  "email": "anna@example.com",
  "phone": "+7(905)123-45-67",
  "tags": ["VIP", "постоянный клиент"]
}
```

**DELETE /api/dashboard/clients/{client_id}**
- Убрать клиента из избранного

### 🎨 Превью дизайнов

**GET /api/dashboard/designs**
- Получить список превью дизайнов

**POST /api/dashboard/designs/{design_id}/favorite**
- Переключить статус избранного для дизайна

### 📝 История взаимодействий

**GET /api/dashboard/interactions**
- Получить историю взаимодействий с клиентами

**POST /api/dashboard/interactions**
- Добавить новое взаимодействие
```json
{
  "client_id": "client_1",
  "action_type": "design_generated",
  "description": "Создан дизайн современной гостиной",
  "details": {"room_type": "гостиная", "style": "современный"}
}
```

### 💡 Предложения элементов дизайна

**GET /api/dashboard/suggestions**
- Получить предложения мебели, декора и цветовых схем

```json
{
  "furniture": [
    {"name": "Диван-кровать", "category": "мебель", "price_range": "30000-80000"}
  ],
  "decor": [
    {"name": "Настенные картины", "category": "декор", "price_range": "5000-20000"}
  ],
  "color_schemes": [
    {"name": "Скандинавский", "colors": ["#FFFFFF", "#F5F5F5", "#E8E8E8", "#8B9DC3"]}
  ]
}
```

## Модели данных

### DailyTask
- `id`: Уникальный идентификатор
- `title`: Заголовок задачи
- `description`: Описание задачи
- `is_completed`: Статус выполнения
- `created_at`: Дата создания
- `target_date`: Целевая дата выполнения

### FavoriteClient
- `id`: Уникальный идентификатор
- `name`: Имя клиента
- `email`: Email
- `phone`: Телефон
- `projects_count`: Количество проектов
- `last_interaction`: Последнее взаимодействие
- `tags`: Теги клиента

### DesignPreview
- `id`: Уникальный идентификатор
- `title`: Название дизайна
- `room_type`: Тип помещения
- `style`: Стиль дизайна
- `image_url`: URL изображения
- `created_at`: Дата создания
- `client_id`: ID клиента
- `is_favorite`: Статус избранного

### InteractionHistory
- `id`: Уникальный идентификатор
- `client_id`: ID клиента
- `action_type`: Тип действия
- `description`: Описание действия
- `details`: Дополнительные детали
- `timestamp`: Время взаимодействия

## Стиль дизайна

В соответствии с требованиями проекта:
- 🎨 **Дизайн**: минималистичный, современный
- 🎨 **Цветовая палитра**: приглушённые синие и серые тона
- 🎨 **Иконки**: чистые и функциональные, в стиле iOS/Material

## Использование

1. Запустите backend сервер:
```bash
cd backend
python main.py
```

2. API доступен по адресу: `http://localhost:8000`

3. Документация Swagger UI: `http://localhost:8000/api/docs`

4. Все endpoints поддерживают CORS для работы с фронтендом

## Особенности

- ✅ Все endpoints возвращают JSON
- ✅ Поддержка async/await для высокой производительности
- ✅ Валидация данных с помощью Pydantic
- ✅ Подробные описания для автодокументации
- ✅ Централизованная обработка ошибок
- ✅ Mock данные для демонстрации функционала

## Azure OpenAI (GPT-4.1) через Entra ID (Azure AD)

**Рекомендуется хранить ключи только в .env, не коммитить их в git!**

### Пример авторизации через Entra ID (Azure Active Directory)

```python
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)
client = AzureOpenAI(
    api_version="2025-01-01-preview",
    azure_endpoint="https://neuroflow-hub.openai.azure.com",
    azure_ad_token_provider=token_provider
)
response = client.chat.completions.create(
    model="gpt-4.1",
    messages=[{"role": "user", "content": "Привет!"}],
    max_tokens=100
)
print(response.choices[0].message.content)
```

- Все параметры (endpoint, deployment, api-version, ключ) берутся из `.env`.
- Для Dashboard интеграции используйте сервис `AzureOpenAIService` (см. `azure_openai_service.py`).
- Для production — используйте переменные окружения, не храните ключи в коде! 