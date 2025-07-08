# Frontend - Red.AI

## 🎨 Архитектура Frontend

Next.js 14 приложение с App Router для Red.AI платформы.

### 📁 Структура

```
src/frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # React компоненты
│   ├── ui/               # UI компоненты (shadcn/ui)
│   ├── dashboard/        # Dashboard компоненты
│   └── common/           # Общие компоненты
├── lib/                   # Утилиты
│   ├── utils.ts          # Общие утилиты
│   ├── store.ts          # State management
│   └── auth.ts           # Аутентификация
├── hooks/                 # Custom hooks
├── types/                 # TypeScript типы
└── styles/               # CSS стили
```

### 🧩 Ключевые компоненты

#### Dashboard
- **ProjectManager** - Управление проектами
- **ImageGenerator** - Генерация изображений
- **ChatInterface** - AI чат
- **ThreeDViewer** - 3D просмотрщик
- **SettingsPanel** - Настройки

#### UI Components
- **Button** - Кнопки (shadcn/ui)
- **Card** - Карточки
- **Modal** - Модальные окна
- **Loading** - Индикаторы загрузки

### 🛠 Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **shadcn/ui** - UI компоненты
- **Zustand** - State management
- **React Query** - Кеширование данных
- **Three.js** - 3D графика

### 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка
npm run build
```

### 🎯 Страницы

- `/` - Главная страница
- `/auth` - Аутентификация
- `/dashboard` - Дашборд
- `/projects` - Проекты
- `/generate` - Генерация дизайнов

### 📱 Адаптивность

- Mobile-first подход
- Поддержка всех устройств
- Оптимизация для тач-интерфейсов 