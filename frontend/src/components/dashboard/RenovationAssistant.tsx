'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Home, Wrench, Palette, Calculator, MessageCircle, Lightbulb, FileText, Camera, X, Settings, Zap, Maximize, Minimize } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card } from '../../../../components/ui/card'
import { useAppStore } from '../../../../lib/store'
import { useTranslations } from '../../../../lib/translations'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  category?: 'design' | 'renovation' | 'real-estate' | 'budget' | 'general'
}

interface RenovationAssistantProps {
  userId?: string
  onClose?: () => void
}

export default function RenovationAssistant({ userId = 'demo_user', onClose }: RenovationAssistantProps) {
  const { t } = useTranslations()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: t('assistant_greeting'),
      timestamp: new Date(),
      category: 'general'
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('general')
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o')
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { language } = useAppStore()

  const quickPrompts = [
    { icon: '🏠', text: t('prompt_raw_apartment'), category: 'renovation' },
    { icon: '🎨', text: t('prompt_choose_style'), category: 'design' },
    { icon: '💰', text: t('prompt_calculate_budget'), category: 'budget' },
    { icon: '🔧', text: t('prompt_best_materials'), category: 'renovation' },
    { icon: '📏', text: t('prompt_layout_zoning'), category: 'design' },
    { icon: '🏢', text: t('prompt_investment_potential'), category: 'real-estate' }
  ]

  const categories = [
    { id: 'general', label: t('category_general'), icon: MessageCircle },
    { id: 'design', label: t('category_design'), icon: Palette },
    { id: 'renovation', label: t('category_renovation'), icon: Wrench },
    { id: 'budget', label: t('category_budget'), icon: Calculator },
    { id: 'real-estate', label: t('category_real_estate'), icon: Home }
  ]

  const models = [
    { id: 'gpt-4o', label: 'GPT-4o', description: t('assistant_most_powerful'), icon: '🚀', cost: '$0.005' },
    { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: t('assistant_fast_accurate'), icon: '⚡', cost: '$0.003' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', description: t('assistant_economical'), icon: '💡', cost: '$0.0001' }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || currentMessage.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      category: selectedCategory as any
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/renovation-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          category: selectedCategory,
          conversation: messages,
          model: selectedModel,
          language // добавляем язык пользователя
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          category: data.category
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '❌ Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'design': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
      case 'renovation': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
      case 'budget': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'real-estate': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-full'} ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-180px)] mt-16'} bg-white dark:bg-gray-900 flex flex-col transition-all duration-300 ${!isFullscreen ? 'rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('nav_ai_assistant')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              {t('dashboard_consultation_description')}
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                {models.find(m => m.id === selectedModel)?.label}
              </span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="hidden md:flex"
          >
            <Settings className="w-4 h-4 mr-1" />
            {t('settings')}
          </Button>

          {/* Fullscreen Toggle Button */}
          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-4 py-2 font-semibold text-sm"
            size="sm"
          >
            <div className="flex items-center gap-2">
              {isFullscreen ? (
                <>
                  <Minimize className="w-4 h-4" />
                  <span>Свернуть</span>
                </>
              ) : (
                <>
                  <Maximize className="w-4 h-4" />
                  <span>Полный экран</span>
                </>
              )}
            </div>
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          {isFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20 hover:border-red-500/30"
            >
              <X className="w-4 h-4" />
              <span className="ml-1">Закрыть</span>
            </Button>
          )}

          {onClose && !isFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Model Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('assistant_model_selection')}
              </h3>
              <div className="space-y-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedModel === model.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{model.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{model.label}</div>
                          <div className="text-xs text-gray-500">{model.description}</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{model.cost}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('assistant_category_selection')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="h-auto p-3 flex flex-col items-center gap-1"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{t(category.label as any)}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('assistant_popular_questions')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(prompt.text)}
              className="text-xs"
              disabled={isLoading}
            >
              <span className="mr-1">{prompt.icon}</span>
              {prompt.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
              <div
                className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                {message.category && message.type === 'assistant' && (
                  <div className={`text-xs mt-2 px-2 py-1 rounded inline-block ${getCategoryColor(message.category)}`}>
                    {categories.find(c => c.id === message.category)?.label}
                  </div>
                )}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('assistant_input_placeholder')}
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {t('assistant_tip')}
        </div>
      </div>
    </div>
  )
} 