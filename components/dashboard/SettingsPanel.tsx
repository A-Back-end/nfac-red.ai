'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Settings, Sun, Moon, User, Globe, BarChart, Camera, Check, X, Upload, Trash2, MapPin, Link, FileText, Palette, BarChart3, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { useTranslation, useTheme } from '../../lib/theme-context'
import { useUserProfile } from '../../lib/user-profile'
import toast from 'react-hot-toast'

export default function SettingsPanel() {
  const { t } = useTranslation()
  const { theme, language, toggleTheme, toggleLanguage } = useTheme()
  const { profile, isLoading, saveProfile, getInitials, uploadAvatar, removeAvatar } = useUserProfile()
  
  const [apiKey, setApiKey] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Сохранение API ключа
  const handleSaveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey)
    toast.success(t('api_key_saved'))
  }

  // Сохранение изменений профиля
  const handleSaveProfile = () => {
    if (saveProfile(profile)) {
      setIsEditingProfile(false)
      toast.success(t('profile_updated'))
    } else {
      toast.error(t('profile_update_failed'))
    }
  }

  // Отмена редактирования профиля
  const handleCancelEdit = () => {
    setIsEditingProfile(false)
  }

  // Загрузка аватара
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверка размера файла (максимум 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('file_too_large'))
      return
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast.error(t('invalid_file_type'))
      return
    }

    setIsUploadingAvatar(true)
    try {
      await uploadAvatar(file)
      toast.success(t('avatar_uploaded'))
    } catch (error) {
      toast.error(t('avatar_upload_failed'))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Удаление аватара
  const handleRemoveAvatar = () => {
    if (removeAvatar()) {
      toast.success(t('avatar_removed'))
    } else {
      toast.error(t('avatar_remove_failed'))
    }
  }

  const handleProfileFieldChange = (field: string, value: string) => {
    // Обновляем локальное состояние профиля сразу для мгновенного отображения
    const updatedProfile = { ...profile, [field]: value }
    saveProfile({ [field]: value })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-900 text-white">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-8 text-white">
        {t('settings')}
      </h1>
      
      {/* Profile Section */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                {t('profile_info')}
              </h2>
            </div>
            <Button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {isEditingProfile ? <X className="h-4 w-4 mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
              {isEditingProfile ? t('cancel') : t('edit_profile')}
            </Button>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-600">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {getInitials()}
                  </div>
                )}
              </div>
              
              {isEditingProfile && (
                <div className="absolute -bottom-2 -right-2 flex space-x-1">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    size="sm"
                    className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploadingAvatar ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {profile.avatar && (
                    <Button
                      onClick={handleRemoveAvatar}
                      size="sm"
                      className="w-8 h-8 p-0 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                {profile.firstName || profile.lastName 
                  ? `${profile.firstName} ${profile.lastName}`.trim()
                  : t('your_name')
                }
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                {profile.email || 'your.email@example.com'}
              </p>
              {profile.bio && (
                <p className="text-slate-300 text-sm">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  {t('first_name')}
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleProfileFieldChange('firstName', e.target.value)}
                  disabled={!isEditingProfile}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isEditingProfile 
                      ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  {t('last_name')}
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleProfileFieldChange('lastName', e.target.value)}
                  disabled={!isEditingProfile}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isEditingProfile 
                      ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                {t('email')}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                disabled={!isEditingProfile}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isEditingProfile 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <User className="inline h-4 w-4 mr-1" />
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                  disabled={!isEditingProfile}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isEditingProfile 
                      ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Globe className="inline h-4 w-4 mr-1" />
                  {t('company')}
                </label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleProfileFieldChange('company', e.target.value)}
                  disabled={!isEditingProfile}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isEditingProfile 
                      ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {t('location')}
                </label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => handleProfileFieldChange('location', e.target.value)}
                  disabled={!isEditingProfile}
                  placeholder="City, Country"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isEditingProfile 
                      ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Link className="inline h-4 w-4 mr-1" />
                  {t('website')}
                </label>
                <input
                  type="url"
                  value={profile.website || ''}
                  onChange={(e) => handleProfileFieldChange('website', e.target.value)}
                  disabled={!isEditingProfile}
                  placeholder="https://example.com"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isEditingProfile 
                      ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                <FileText className="inline h-4 w-4 mr-1" />
                {t('bio')}
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                disabled={!isEditingProfile}
                rows={3}
                placeholder={t('tell_about_yourself')}
                className={`w-full px-3 py-2 rounded-lg border resize-none ${
                  isEditingProfile 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-blue-500'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-not-allowed'
                }`}
              />
            </div>
            
            {isEditingProfile && (
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t('save_changes')}
                </Button>
                <Button 
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                                      <X className="h-4 w-4 mr-2" />
                    {t('cancel')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Key Section */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Camera className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">
              {t('api_configuration')}
            </h2>
          </div>
          <p className="mb-4 text-slate-400">
            Configure your OpenAI API key for AI features
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                {t('openai_api_key')}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Your API key is stored locally and never shared
              </p>
            </div>
            
            <Button 
              onClick={handleSaveApiKey}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              {t('save_api_key')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-3">
            <Palette className="h-5 w-5 text-pink-400" />
            <span>{t('appearance')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{t('dark_mode')}</p>
              <p className="text-slate-400 text-sm">{t('toggle_theme')}</p>
            </div>
            <Button 
              onClick={toggleTheme}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{t('language')}</p>
              <p className="text-slate-400 text-sm">{t('change_language')}</p>
            </div>
            <Button 
              onClick={toggleLanguage}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {language === 'en' ? 'EN' : 'RU'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics Section */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <span>{t('usage_statistics')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">0</div>
              <div className="text-sm text-slate-400">{t('total_requests')}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">$0.00</div>
              <div className="text-sm text-slate-400">{t('total_cost')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 