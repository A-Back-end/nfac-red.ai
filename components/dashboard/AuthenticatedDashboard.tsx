'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { 
  Settings, 
  Heart, 
  LogOut,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Wand2,
  FolderOpen,
  Sun,
  Moon,
  X,
  Maximize2,
  Zap,
  Sparkles,
  BarChart3,
  Bell,
  Plus,
  Star,
  Palette,
  Home,
  Users,
  TrendingUp
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { useTheme, useTranslation } from '../../lib/theme-context'
import { useUserProfile } from '../../lib/user-profile'

// Import dashboard components
import FluxDesigner from './FluxDesigner'
import RenovationAssistant from './RenovationAssistant'
import DomovenokAIAssistant from './DomovenokAIAssistant'
import SettingsPanel from './SettingsPanel'
import ProjectManager from './ProjectManager'
import SavedDesigns from './SavedDesigns'

type ViewType = 'flux-designer' | 'ai-assistant' | 'my-projects' | 'saved-designs' | 'settings' | 'dashboard'

export function AuthenticatedDashboard() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { t } = useTranslation()
  const { language, theme, toggleLanguage, toggleTheme } = useTheme()
  const { profile, getDisplayName, getInitials } = useUserProfile()
  
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [projectSaveMessage, setProjectSaveMessage] = useState<string | null>(null)
  const [refreshProjects, setRefreshProjects] = useState(0)

  useEffect(() => {
    // Check if Clerk is loaded and user is authenticated
    if (isLoaded && !user) {
      router.push('/login')
      return
    }
    
    // The theme will be automatically applied by the store's setTheme function
    // No need for manual theme initialization here since it's handled by the store
  }, [isLoaded, user, router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback redirect
    window.location.href = '/'
    }
  }

  const navigationItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'ai-assistant', label: t('aiAssistant'), icon: MessageCircle, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'flux-designer', label: t('designStudio'), icon: Wand2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { id: 'my-projects', label: t('projects'), icon: FolderOpen, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { id: 'saved-designs', label: t('saved'), icon: Heart, color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
    { id: 'settings', label: t('settings'), icon: Settings, color: 'text-slate-400', bgColor: 'bg-slate-500/10' }
  ]

  // Show loading state while Clerk is loading
  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-900 dark:text-white text-lg font-medium">Loading RED AI</p>
            <p className="text-slate-600 dark:text-slate-400">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Modern Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } shadow-lg dark:shadow-slate-900/50`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    RED AI
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Design Assistant</p>
                </div>
              )}
            </div>
          </div>

          {/* User Profile */}
          {/* User Profile Section */}
          <div className="p-4">
            {sidebarCollapsed ? (
              /* Compact Profile for Collapsed Sidebar */
              <div className="flex flex-col items-center space-y-2">
                <div 
                  className="relative cursor-pointer"
                  title={`${user.firstName || user.username || 'User'} ${user.lastName || ''} - ${user.primaryEmailAddress?.emailAddress || 'user@example.com'}`}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500/50 transition-all duration-200">
                    {user.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.firstName?.[0] || user.username?.[0] || 'U'}{user.lastName?.[0] || ''}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-50 dark:border-slate-900"></div>
                </div>
              </div>
            ) : (
              /* Full Profile for Expanded Sidebar */
              <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl overflow-hidden">
                        {user.imageUrl ? (
                          <img 
                            src={user.imageUrl} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {user.firstName?.[0] || user.username?.[0] || 'U'}{user.lastName?.[0] || ''}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-50 dark:border-slate-900"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user.username || 'User'
                        }
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {user.primaryEmailAddress?.emailAddress || 'user@example.com'}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs border-purple-500/30 text-purple-400">
                        Pro Plan
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center pl-4' : 'space-x-3'} 
                    px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                    ${isActive 
                      ? `${item.bgColor} text-slate-900 dark:text-white shadow-lg` 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 ${isActive ? item.color : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`w-full ${sidebarCollapsed ? 'px-0' : 'justify-start'} 
                border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50`}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full 
            flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-50"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-slate-600 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* Top Bar */}
      <div className={`fixed top-0 right-0 left-0 ${sidebarCollapsed ? 'ml-20' : 'ml-72'} 
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 z-30`}>
        <div className="px-6 py-4 flex items-center justify-end">
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 px-3"
            >
              {language === 'en' ? 'RU' : 'EN'}
            </Button>
            
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 px-3"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-400" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 px-3"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'} pt-20`}>
        {currentView === 'dashboard' && (
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Welcome back, {getDisplayName()}! 👋
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Ready to create something amazing today? Let's get started.
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Total Projects</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">AI Generations</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">147</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Saved Designs</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">38</p>
                      </div>
                      <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                        <Heart className="h-6 w-6 text-rose-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">This Month</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">+23%</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all cursor-pointer"
                  onClick={() => setCurrentView('ai-assistant')}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">AI Assistant</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Ask questions, get expert advice</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all cursor-pointer"
                  onClick={() => setCurrentView('flux-designer')}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Wand2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Design Studio</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Create stunning AI-generated designs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all cursor-pointer"
                  onClick={() => setCurrentView('my-projects')}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">My Projects</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Manage your design projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-5">
                    <div className="flex items-center space-x-5">
                      <div className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white text-sm">Generated new kitchen design</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-5">
                      <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white text-sm">Consulted with AI about bathroom renovation</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-5">
                      <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white text-sm">Created new project "Living Room Makeover"</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {currentView === 'ai-assistant' && (
          <div className="h-[calc(100vh-5rem)]">
              <DomovenokAIAssistant 
                userId={user?.id || ''} 
              />
          </div>
        )}
        
        {currentView === 'flux-designer' && (
          <FluxDesigner 
            onAnalyze={(data) => {
              console.log('Analyzing:', data)
              setProjectSaveMessage('✅ Analysis completed successfully!')
              setTimeout(() => setProjectSaveMessage(null), 3000)
            }}
            onGenerate={(data) => {
              console.log('Generating:', data)
              setProjectSaveMessage('✅ Image generation started!')
              setTimeout(() => setProjectSaveMessage(null), 3000)
            }}
            onDesign={(data) => {
              console.log('Complex design:', data)
              setProjectSaveMessage('✅ Complex design is being created!')
              setTimeout(() => setProjectSaveMessage(null), 3000)
            }}
          />
        )}
        
        {currentView === 'my-projects' && (
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="h-5 w-5 text-white" />
                    </div>
                    <span>My Projects</span>
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Manage and organize your design projects</p>
                </div>
                <Button 
                  onClick={() => setCurrentView('flux-designer')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
              
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="h-12 w-12 text-slate-500 dark:text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No projects yet</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Get started by creating your first project. Use our AI tools to generate stunning designs and manage your renovation projects.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => setCurrentView('flux-designer')}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Start Creating
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('ai-assistant')}
                    variant="outline"
                    className="border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Get Ideas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'saved-designs' && (
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span>Saved Designs</span>
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Your favorite AI-generated designs</p>
                </div>
              </div>
              
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-12 w-12 text-slate-500 dark:text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No saved designs</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Save your favorite AI-generated designs to access them quickly. Create some designs first to build your collection.
                </p>
                <Button 
                  onClick={() => setCurrentView('flux-designer')}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Designs
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'settings' && (
          <SettingsPanel />
        )}
      </div>

      {/* Notification */}
      {projectSaveMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg border border-emerald-500/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>{projectSaveMessage}</span>
            <button 
              onClick={() => setProjectSaveMessage(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 