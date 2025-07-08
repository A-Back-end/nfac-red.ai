/**
 * Utilities for Domovenok AI Assistant
 * Helper functions, constants, and formatting utilities
 */

export interface DomovenokRole {
  id: string
  name: string
  emoji: string
  description: string
  specialization: string
}

export interface DomovenokStyle {
  id: string
  name: string
  emoji: string
  description: string
}

export interface QuickQuestion {
  category: string
  icon: string
  questions: string[]
}

// Роли Домовёнка
export const DOMOVENOK_ROLES: DomovenokRole[] = [
  {
    id: 'realtor',
    name: 'Риелтор',
    emoji: '🏠',
    description: 'Эксперт по покупке, продаже и оценке недвижимости',
    specialization: 'realtor'
  },
  {
    id: 'interior_designer',
    name: 'Дизайнер интерьера',
    emoji: '🎨',
    description: 'Профессиональный дизайнер для создания уютных интерьеров',
    specialization: 'designer'
  },
  {
    id: 'renovation_expert',
    name: 'Эксперт по ремонту',
    emoji: '🔨',
    description: 'Специалист по планированию и бюджетированию ремонта',
    specialization: 'consultant'
  },
  {
    id: 'investment_advisor',
    name: 'Инвестиционный консультант',
    emoji: '💰',
    description: 'Советник по инвестициям в недвижимость',
    specialization: 'consultant'
  },
  {
    id: 'universal',
    name: 'Универсальный консультант',
    emoji: '🏆',
    description: 'Все в одном: риелтор + дизайнер + консультант',
    specialization: 'consultant'
  }
]

// Стили общения
export const COMMUNICATION_STYLES: DomovenokStyle[] = [
  {
    id: 'friendly',
    name: 'Дружелюбный',
    emoji: '😊',
    description: 'Теплое, неформальное общение с эмодзи'
  },
  {
    id: 'professional',
    name: 'Профессиональный',
    emoji: '💼',
    description: 'Деловой, четкий стиль общения'
  },
  {
    id: 'expert',
    name: 'Экспертный',
    emoji: '🎓',
    description: 'Глубокие знания с техническими деталями'
  },
  {
    id: 'casual',
    name: 'Простой',
    emoji: '👋',
    description: 'Простой язык, легкий для понимания'
  }
]

// Быстрые вопросы по категориям
export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    category: 'Покупка квартиры',
    icon: '🏠',
    questions: [
      'Как выбрать квартиру для покупки?',
      'На что обратить внимание при просмотре квартиры?',
      'Как оценить справедливую стоимость квартиры?',
      'Какие документы нужны для покупки?',
      'Как выбрать хороший район для покупки?',
      'Стоит ли покупать квартиру в новостройке?'
    ]
  },
  {
    category: 'Дизайн интерьера',
    icon: '🎨',
    questions: [
      'Как создать уютный интерьер в маленькой квартире?',
      'Какие цвета выбрать для спальни?',
      'Как правильно зонировать студию?',
      'Современные тренды в дизайне интерьера',
      'Как выбрать правильное освещение?',
      'Какую мебель выбрать для гостиной?'
    ]
  },
  {
    category: 'Ремонт и планирование',
    icon: '🔨',
    questions: [
      'Как составить бюджет на ремонт?',
      'С чего начать ремонт квартиры?',
      'Какие материалы лучше выбрать?',
      'Как планировать этапы ремонта?',
      'Сколько времени займет ремонт?',
      'Как найти хороших мастеров?'
    ]
  },
  {
    category: 'Инвестиции',
    icon: '💰',
    questions: [
      'Стоит ли покупать квартиру для сдачи в аренду?',
      'Как выбрать районы для инвестиций?',
      'Какая доходность от аренды квартир?',
      'Риски инвестиций в недвижимость',
      'Как рассчитать окупаемость инвестиций?',
      'Коммерческая или жилая недвижимость?'
    ]
  },
  {
    category: 'Продажа недвижимости',
    icon: '📈',
    questions: [
      'Как правильно оценить стоимость квартиры?',
      'Как подготовить квартиру к продаже?',
      'Какие документы нужны для продажи?',
      'Как найти покупателя быстро?',
      'Стоит ли делать ремонт перед продажей?',
      'Как правильно провести сделку?'
    ]
  }
]

/**
 * Получить роль по ID
 */
export function getRoleById(roleId: string): DomovenokRole | undefined {
  return DOMOVENOK_ROLES.find(role => role.id === roleId)
}

/**
 * Получить стиль по ID
 */
export function getStyleById(styleId: string): DomovenokStyle | undefined {
  return COMMUNICATION_STYLES.find(style => style.id === styleId)
}

/**
 * Форматировать сообщение для отображения
 */
export function formatMessage(content: string): string {
  // Обработка markdown-подобного форматирования
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

/**
 * Получить приветственное сообщение
 */
export function getWelcomeMessage(roleName: string = 'Универсальный консультант'): string {
  return `Привет! Меня зовут **Домовёнок** 🏠✨ 

Я ваш персональный AI-помощник по недвижимости и дизайну интерьера! 
Сегодня работаю в роли: **${roleName}**

**Как я могу помочь:**
🏠 **Консультации по недвижимости** - покупка, продажа, оценка
🎨 **Дизайн интерьера** - планировка, стили, цвета, мебель  
🔨 **Планирование ремонта** - бюджет, этапы, материалы
💰 **Инвестиционные советы** - анализ рынка, доходность

Выберите тему ниже или просто задайте свой вопрос! 👇`
}

/**
 * Получить сообщение об очистке чата
 */
export function getClearChatMessage(): string {
  return `Чат очищен! Готов помочь вам снова 🏠✨

Задайте любой вопрос по недвижимости или дизайну интерьера!`
}

/**
 * Валидация сообщения
 */
export function validateMessage(message: string): { isValid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Сообщение не может быть пустым' }
  }
  
  if (message.length > 4000) {
    return { isValid: false, error: 'Сообщение слишком длинное (максимум 4000 символов)' }
  }
  
  return { isValid: true }
}

/**
 * Получить статистику сообщения
 */
export function getMessageStats(message: string): {
  characters: number
  words: number
  estimatedTokens: number
} {
  const characters = message.length
  const words = message.trim().split(/\s+/).length
  const estimatedTokens = Math.ceil(characters / 4) // Примерная оценка для русского текста
  
  return { characters, words, estimatedTokens }
}

/**
 * Генерировать уникальный ID для сообщения
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Форматировать время
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

/**
 * Проверить, является ли сообщение пользователя вопросом
 */
export function isQuestion(message: string): boolean {
  const questionWords = ['как', 'что', 'где', 'когда', 'почему', 'зачем', 'сколько', 'какой', 'какая', 'какое', 'какие']
  const lowerMessage = message.toLowerCase()
  
  return questionWords.some(word => lowerMessage.includes(word)) || 
         message.includes('?') ||
         lowerMessage.startsWith('можно ли') ||
         lowerMessage.startsWith('стоит ли')
}

/**
 * Получить тему сообщения по ключевым словам
 */
export function detectTopic(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  const topics = {
    'покупка': ['купить', 'покупка', 'приобрести', 'выбрать квартиру'],
    'продажа': ['продать', 'продажа', 'реализовать'],
    'дизайн': ['дизайн', 'интерьер', 'цвет', 'мебель', 'планировка'],
    'ремонт': ['ремонт', 'отделка', 'материалы', 'строительство'],
    'инвестиции': ['инвестиции', 'доходность', 'аренда', 'рентабельность'],
    'документы': ['документы', 'договор', 'сделка', 'оформление']
  }
  
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return topic
    }
  }
  
  return 'общие'
}

export default {
  DOMOVENOK_ROLES,
  COMMUNICATION_STYLES,
  QUICK_QUESTIONS,
  getRoleById,
  getStyleById,
  formatMessage,
  getWelcomeMessage,
  getClearChatMessage,
  validateMessage,
  getMessageStats,
  generateMessageId,
  formatTime,
  isQuestion,
  detectTopic
} 