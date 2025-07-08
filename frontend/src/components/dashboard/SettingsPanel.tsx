'use client'

import React, { useState } from 'react'
import { Settings, Key, Moon, Sun, Zap, Trash2, Save, Eye, EyeOff, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { useAppStore } from '../../../../lib/store'
import { cn } from '../../../../lib/utils'
import toast from 'react-hot-toast'
import { useTranslations } from '../../../../lib/translations'

/**
 * Settings Panel Component
 * Manages API keys, preferences, and application settings
 */
export function SettingsPanel() {
  const { t, language, setLanguage } = useTranslations()
  const { 
    openaiApiKey, 
    setOpenaiApiKey,
    darkMode,
    setDarkMode,
    resetTokenUsage,
    clearChatHistory,
    totalTokensUsed,
    totalCost,
    setLanguage: setStoreLanguage
  } = useAppStore()
  
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handle API key save
   */
  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast.error('Please enter a valid API key')
      return
    }

    setIsLoading(true)
    try {
      // Basic validation (OpenAI keys start with sk-)
      if (!apiKeyInput.startsWith('sk-')) {
        toast.error('Invalid OpenAI API key format')
        return
      }

      setOpenaiApiKey(apiKeyInput.trim())
      setApiKeyInput('')
      toast.success('API key saved successfully!')
    } catch (error) {
      toast.error('Failed to save API key')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle API key removal
   */
  const handleRemoveApiKey = () => {
    if (window.confirm('Are you sure you want to remove your API key?')) {
      setOpenaiApiKey('')
      toast.success('API key removed')
    }
  }

  /**
   * Handle data reset
   */
  const handleResetData = () => {
    const confirmed = window.confirm(
      'This will clear all chat history and reset token usage. Are you sure?'
    )
    
    if (confirmed) {
      clearChatHistory()
      resetTokenUsage()
      toast.success('Data reset successfully')
    }
  }

  const handleLanguageChange = (lang: 'en' | 'ru') => {
    setLanguage(lang)
    setStoreLanguage(lang)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          {t('settings')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('settings_description')}
        </p>
      </div>

      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>OpenAI API Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your OpenAI API key to enable AI features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current API Key Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                openaiApiKey ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-sm font-medium">
                {openaiApiKey ? 'API Key Configured' : 'No API Key Set'}
              </span>
            </div>
            {openaiApiKey && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  ••••••••{openaiApiKey.slice(-4)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveApiKey}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              OpenAI API Key
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-1 top-1 h-8 w-8"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim() || isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your API key is stored locally and never shared. Get one from{' '}
              <a 
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          {/* API Usage Info */}
          {openaiApiKey && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                API Usage Information
              </h4>
              <ul className="mt-2 text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• GPT-4 Vision: ~$0.01-0.05 per image analysis</li>
                <li>• GPT-4 Turbo: ~$0.01-0.03 per 1K tokens</li>
                <li>• Stable Diffusion XL: ~$0.002 per generated image</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Dark Mode
              </h4>
              <p className="text-sm text-gray-500">
                Switch between light and dark themes
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center space-x-2"
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Language</span>
          </CardTitle>
          <CardDescription>
            Change the language of the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Current Language
              </h4>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'English' : 'Русский'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLanguageChange(language === 'en' ? 'ru' : 'en')}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'Русский' : 'English'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Usage Statistics</span>
          </CardTitle>
          <CardDescription>
            Track your API usage and costs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totalTokensUsed.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">Total Tokens</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${totalCost.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Total Cost</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={resetTokenUsage}
            className="w-full text-orange-600 hover:text-orange-700"
          >
            <Zap className="mr-2 h-4 w-4" />
            Reset Usage Statistics
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>
            Manage your stored data and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={clearChatHistory}
              className="w-full text-orange-600 hover:text-orange-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat History
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResetData}
              className="w-full text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset All Data
            </Button>
          </div>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> Resetting data will permanently delete all chat history, 
              projects, and usage statistics. This action cannot be undone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About RED AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p>
            RED AI is an intelligent assistant for interior design and real estate analysis. 
            It uses advanced AI to analyze floor plans, suggest improvements, and provide 
            design recommendations.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t">
            <div>
              <strong>Version:</strong> 1.0.0
            </div>
            <div>
              <strong>Build:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 