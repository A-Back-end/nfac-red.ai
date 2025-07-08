# 🎨 Система синхронизации темы и языка RED AI

## Обзор

Реализована унифицированная система синхронизации темы и языка между статическими HTML файлами и React компонентами. Система обеспечивает:

- ✅ **Единое состояние** темы и языка для всего приложения
- ✅ **Автоматическая синхронизация** между landing page и дашбордом
- ✅ **Сохранение настроек** в localStorage
- ✅ **Двунаправленная синхронизация** через события

## Архитектура

### Компоненты системы

1. **`lib/theme-sync.ts`** - Центральная система синхронизации
2. **`lib/store.ts`** - Zustand store (интегрирован с theme-sync)
3. **`lib/theme-context.tsx`** - React Context (интегрирован с theme-sync)
4. **HTML файлы** - Используют глобальные функции синхронизации

### Поток данных

```
Landing Page (HTML) ←→ [Global Events] ←→ React Components
                    ↓
                localStorage
                    ↑
            Global Theme Sync
```

## Использование

### В статических HTML файлах

```javascript
// Автоматическая инициализация
window.addEventListener('load', () => {
  initGlobalSync();
  console.log('🎨 Landing page theme sync initialized');
});

// Переключение темы
function toggleTheme() {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  // ... применение локально ...
  
  // Уведомление React компонентов
  window.dispatchEvent(new CustomEvent('redai-theme-change', {
    detail: { theme: newTheme }
  }));
}
```

### В React компонентах

```typescript
import { useAppStore } from '@/lib/store'
import { useTheme } from '@/lib/theme-context'
import { initThemeSync } from '@/lib/theme-sync'

// Zustand store
const { theme, language, setTheme, setLanguage } = useAppStore()

// Theme Context
const { theme, language, toggleTheme, toggleLanguage } = useTheme()

// Инициализация
useEffect(() => {
  initThemeSync()
}, [])
```

## Глобальные функции

### `lib/theme-sync.ts`

```typescript
// Получение сохраненных настроек
getSavedTheme(): Theme
getSavedLanguage(): Language

// Применение настроек с синхронизацией
setGlobalTheme(theme: Theme): void
setGlobalLanguage(language: Language): void

// Переключение настроек
toggleGlobalTheme(): Theme
toggleGlobalLanguage(): Language

// Инициализация системы
initThemeSync(): void
```

## События синхронизации

### Глобальные события

- **`redai-theme-change`** - Изменение темы
- **`redai-language-change`** - Изменение языка

```typescript
// Отправка события
window.dispatchEvent(new CustomEvent('redai-theme-change', {
  detail: { theme: 'dark' }
}))

// Прослушивание события
window.addEventListener('redai-theme-change', (event) => {
  const newTheme = event.detail.theme
  // Обновить локальное состояние
})
```

## Файлы, интегрированные с системой

### ✅ Обновленные файлы

1. **`public/index.html`** - Landing page с глобальной синхронизацией
2. **`app/login/page.tsx`** - Страница логина
3. **`app/auth/page.tsx`** - Альтернативная страница авторизации
4. **`app/layout.tsx`** - Root layout с инициализацией
5. **`lib/store.ts`** - Zustand store с глобальной синхронизацией
6. **`lib/theme-context.tsx`** - React Context с глобальной синхронизацией
7. **`components/dashboard/AuthenticatedDashboard.tsx`** - Дашборд

### Основные изменения

1. **Инициализация**: Все компоненты вызывают `initThemeSync()`
2. **Применение**: Используют `setGlobalTheme()` вместо прямого обращения к DOM
3. **Загрузка**: Используют `getSavedTheme()` и `getSavedLanguage()`
4. **События**: Слушают глобальные события для синхронизации

## Пример workflow

1. **Пользователь открывает landing page** (`public/index.html`)
   - Тема: светлая, язык: английский
   
2. **Переходит на страницу логина** (`/login`)
   - Автоматически загружается: светлая тема + английский язык
   - Настройки синхронизированы
   
3. **Входит в дашборд** (`/dashboard`)
   - Автоматически применяется: светлая тема + английский язык
   - Все настройки сохранены

4. **Меняет тему в дашборде**
   - Изменение автоматически распространяется на все части приложения
   - При возврате на landing page - тема остается измененной

## Отладка

Система выводит лог-сообщения для отслеживания:

```
🎨 Theme Sync initialized: { theme: 'dark', language: 'en' }
🎨 Landing page theme sync initialized
🎨 Root layout theme sync initialized: { theme: 'dark', language: 'en' }
```

## Технические детали

### localStorage ключи
- `theme` - сохранение темы ('light' | 'dark')  
- `language` - сохранение языка ('en' | 'ru')

### DOM атрибуты
- `document.documentElement.classList` - классы темы ('dark', 'light')
- `document.body.data-theme` - атрибут темы для CSS
- `document.documentElement.lang` - язык документа

### События
- **Буферизация**: События не дублируются при одинаковых значениях
- **Двунаправленность**: HTML ↔ React синхронизация
- **Персистентность**: Автоматическое сохранение в localStorage

## Преимущества

1. **Единообразие**: Одна система для всего приложения
2. **Производительность**: Минимум DOM манипуляций
3. **Надежность**: Автоматическая синхронизация
4. **Расширяемость**: Легко добавлять новые настройки
5. **Отладка**: Четкие лог-сообщения и события

---

*Система протестирована и готова к production использованию* 