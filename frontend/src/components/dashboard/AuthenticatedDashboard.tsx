'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  Settings, 
  User as UserIcon, 
  Heart, 
  Camera,
  LogOut,
  Edit2,
  Target,
  Calendar,
  Users,
  Star,
  Sun,
  Moon,
  Wand2,
  Home,
  FolderOpen,
  Box,
  Palette,
  Eye,
  RotateCcw,
  Loader2,
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'

import { SavedDesigns } from './SavedDesigns'
import ImageGenerator from './ImageGenerator'
import ThreeDViewer from './ThreeDViewer'
import { AuthService, type User } from '../../../../lib/auth'
import { useTranslation } from '../../../../lib/theme-context'
import { useAppStore } from '../../../../lib/store'
import RenovationAssistant from './RenovationAssistant'
import { SettingsPanel } from './SettingsPanel'
import ProjectManager from './ProjectManager'
import FluxDesigner from './FluxDesigner'

type ViewType = 'flux-designer' | 'ai-assistant' | 'my-projects' | 'saved-designs' | 'settings'

export function AuthenticatedDashboard() {
  const router = useRouter()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const { language, theme, setLanguage, setTheme } = useAppStore()
  
  const [currentView, setCurrentView] = useState<ViewType>('flux-designer')
  const [user, setUser] = useState<User | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState({ firstName: '', lastName: '' })

  // Projects integration
  const [refreshProjects, setRefreshProjects] = useState(0)
  const [projectSaveMessage, setProjectSaveMessage] = useState<string | null>(null)
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  


  useEffect(() => {
    // Check authentication
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
    setEditName({ 
      firstName: currentUser.firstName || '', 
      lastName: currentUser.lastName || '' 
    })
    
    // Theme is now managed by the global store, no need for manual DOM manipulation

    // Handle switch to projects from AI Analyzer
    const handleSwitchToProjects = () => {
      setCurrentView('my-projects')
    }

    window.addEventListener('switchToProjects', handleSwitchToProjects)
    
    return () => {
      window.removeEventListener('switchToProjects', handleSwitchToProjects)
    }
  }, [router])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const toggleLanguage = () => {
    const newLanguage: 'en' | 'ru' = language === 'en' ? 'ru' : 'en'
    setLanguage(newLanguage)
  }

  const handleLogout = () => {
    AuthService.logout()
    window.location.href = '/'
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const photoUrl = await AuthService.uploadProfilePhoto(file)
      const updatedUser = await AuthService.updateProfilePhoto(photoUrl)
      setUser(updatedUser)
    } catch (error) {
      console.error('Photo update error:', error)
      alert('Ошибка обновления фото. Попробуйте еще раз.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleNameSave = () => {
    // In real app, you would call API to update name
    setUser((prev: User | null) => prev ? {
      ...prev,
      firstName: editName.firstName,
      lastName: editName.lastName
    } : null)
    setIsEditingName(false)
  }



  const handleProjectCreated = (project: any) => {
    console.log('New project created:', project)
    // Trigger refresh of projects list
    setRefreshProjects(prev => prev + 1)
    
    // Show success message
    setProjectSaveMessage(`✅ Анализ сохранен в "Мои проекты": ${project.name}`)
    setTimeout(() => setProjectSaveMessage(null), 5000)
    
    // Optionally switch to My Projects tab to show the new project
    // setCurrentView('my-projects')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-all duration-300 relative">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-20 border-r border-slate-200/50 dark:border-slate-700/50 z-10 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            {!sidebarCollapsed && (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">RED AI</h1>
            )}
          </div>

          {/* User Profile Section */}
          {!sidebarCollapsed && (
            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-600">
                    {user.profilePhoto ? (
                      <img 
                        src={user.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {uploadingPhoto ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  {isEditingName ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName.firstName}
                        onChange={(e) => setEditName(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                        placeholder={t('dashboard_first_name')}
                      />
                      <input
                        type="text"
                        value={editName.lastName}
                        onChange={(e) => setEditName(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                        placeholder={t('dashboard_last_name')}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleNameSave}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          {t('dashboard_save')}
                        </button>
                        <button
                          onClick={() => setIsEditingName(false)}
                          className="text-xs bg-slate-600 text-white px-2 py-1 rounded hover:bg-slate-700"
                        >
                          {t('dashboard_cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </h3>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 truncate max-w-[160px]" title={user.email}>{user.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Navigation */}
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView('ai-assistant')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'ai-assistant'
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-l-4 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={sidebarCollapsed ? 'ИИ Помощник' : ''}
            >
              <MessageCircle className="h-5 w-5" />
              {!sidebarCollapsed && <span>ИИ Помощник</span>}
            </button>
            
            <button
              onClick={() => setCurrentView('flux-designer')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'flux-designer'
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-l-4 border-purple-500 text-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={sidebarCollapsed ? 'Premium Designer' : ''}
            >
              <Wand2 className="h-5 w-5" />
              {!sidebarCollapsed && <span>Premium Designer</span>}
            </button>
            
            <button
              onClick={() => setCurrentView('my-projects')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'my-projects'
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-l-4 border-green-500 text-green-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={sidebarCollapsed ? 'My Projects' : ''}
            >
              <FolderOpen className="h-5 w-5" />
              {!sidebarCollapsed && <span>My Projects</span>}
            </button>
            
            <button
              onClick={() => setCurrentView('saved-designs')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'saved-designs'
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-l-4 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={sidebarCollapsed ? t('dashboard_saved_designs') : ''}
            >
              <Heart className="h-5 w-5" />
              {!sidebarCollapsed && <span>{t('dashboard_saved_designs')}</span>}
            </button>
            
            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'settings'
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-l-4 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={sidebarCollapsed ? t('dashboard_settings') : ''}
            >
              <Settings className="h-5 w-5" />
              {!sidebarCollapsed && <span>{t('dashboard_settings')}</span>}
            </button>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center space-x-2'} px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300`}
              title={sidebarCollapsed ? t('dashboard_logout') : ''}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && <span>{t('dashboard_logout')}</span>}
            </button>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 -right-3 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center z-20"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3 h-3 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Theme and Language Toggle Buttons */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button
          onClick={toggleLanguage}
          className="w-12 h-12 bg-white/20 dark:bg-slate-800/70 backdrop-blur-20 border border-slate-200/30 dark:border-slate-700/70 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg text-slate-700 dark:text-slate-300 font-bold text-sm"
          title={t('dashboard_change_language')}
        >
          {language === 'en' ? 'RU' : 'EN'}
        </button>
        
        <button
          onClick={toggleTheme}
          className="w-12 h-12 bg-white/20 dark:bg-slate-800/70 backdrop-blur-20 border border-slate-200/30 dark:border-slate-700/70 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
          title={theme === 'dark' ? t('dashboard_light_theme') : t('dashboard_dark_theme')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-blue-600" />
          )}
        </button>
      </div>

      {/* Project Save Notification */}
      {projectSaveMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in-from-right">
          <span className="text-lg">📁</span>
          <span>{projectSaveMessage}</span>
          <button 
            onClick={() => setProjectSaveMessage(null)}
            className="ml-2 text-white hover:text-green-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={`p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {currentView === 'ai-assistant' && (
          <RenovationAssistant 
            userId="demo_user"
            onClose={() => setCurrentView('my-projects')}
          />
        )}
        
        {currentView === 'flux-designer' && (
          <FluxDesigner 
            onAnalyze={(data) => {
              console.log('Analyzing:', data)
              // Handle analysis logic
            }}
            onGenerate={(data) => {
              console.log('Generating:', data)
              // Handle generation logic
            }}
            onDesign={(data) => {
              console.log('Complex design:', data)
              // Handle complex design logic
            }}
          />
        )}
        
        {currentView === 'my-projects' && (
          <ProjectManager 
            userId="demo_user" 
            refreshProjects={refreshProjects}
          />
        )}
        {currentView === 'saved-designs' && <SavedDesigns />}
        {currentView === 'settings' && <SettingsPanel />}
      </div>
    </div>
  )
} 