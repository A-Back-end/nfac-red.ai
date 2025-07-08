'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Home,
  Settings, 
  Upload, 
  FolderOpen,
  Image as ImageIcon, 
  BarChart3,
  Palette,
  MessageSquare,
  Users,
  Heart,
  DollarSign,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react'

// Import dashboard components
import RenovationAssistant from './RenovationAssistant'
import ProjectManager from './ProjectManager'
import ImageGenerator from './ImageGenerator'
import { Project } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { useTranslations } from '@/lib/translations'

interface DashboardStats {
  totalProjects: number
  completedAnalyses: number
  savedDesigns: number
  totalBudget: number
}

export default function RedAIDashboard() {
  const { t } = useTranslations()
  // Используем Zustand store
  const { projects } = useAppStore()
  
  const [activeTab, setActiveTab] = useState<'analyzer' | 'projects' | 'generator' | 'designs' | 'chat' | 'settings'>('analyzer')
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedAnalyses: 0,
    savedDesigns: 0,
    totalBudget: 0
  })
  const [refreshProjects, setRefreshProjects] = useState(0)
  const [userId] = useState('demo_user')

  // Загружаем статистику из localStorage при изменении проектов
  useEffect(() => {
    loadDashboardStats()
  }, [projects, refreshProjects])

  const loadDashboardStats = () => {
    try {
      // Вычисляем статистику из локальных проектов
      setStats({
        totalProjects: projects.length,
        completedAnalyses: projects.filter((p: Project) => p.roomAnalysis).length,
        savedDesigns: projects.filter((p: Project) => p.designRecommendation).length,
        totalBudget: projects.reduce((sum: number, p: Project) => sum + p.budget.max, 0)
      })
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
      // Устанавливаем статистику по умолчанию
      setStats({
        totalProjects: 0,
        completedAnalyses: 0,
        savedDesigns: 0,
        totalBudget: 0
      })
    }
  }

  const handleProjectCreated = (project: Project) => {
    // Обновляем статистику и список проектов
    setRefreshProjects(prev => prev + 1)
    
    // Автоматически переключаемся на вкладку проектов для просмотра созданного проекта
    setTimeout(() => {
      if (activeTab === 'analyzer') {
        // Показываем уведомление о сохранении
        // setActiveTab('projects')
      }
    }, 2000)
  }

  const navItems = [
    { 
      id: 'analyzer' as const, 
      label: t('nav_ai_assistant'), 
      icon: MessageSquare, 
      description: t('dashboard_consultation_description')
    },
    { 
      id: 'projects' as const, 
      label: t('nav_my_projects'), 
      icon: FolderOpen, 
      description: t('dashboard_project_history')
    },
    { 
      id: 'generator' as const, 
      label: t('nav_image_generator'), 
      icon: ImageIcon, 
      description: t('dashboard_design_visualization')
    },
    { 
      id: 'designs' as const, 
      label: t('nav_saved_designs'), 
      icon: Star, 
      description: t('dashboard_favorite_solutions')
    },
    { 
      id: 'chat' as const, 
      label: t('nav_ai_consultant'), 
      icon: MessageSquare, 
      description: t('dashboard_chat_with_designer')
    },
    { 
      id: 'settings' as const, 
      label: t('nav_settings'), 
      icon: Settings, 
      description: t('dashboard_profile_preferences')
    }
  ]

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }: {
    icon: any
    title: string
    value: string | number
    subtitle: string
    color?: string
  }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
      </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
            </div>
          </div>
    </Card>
  )

    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RED AI Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_subtitle')}</p>
            </div>
              </div>
              
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>
                </div>
                </div>

      {/* Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FolderOpen}
            title={t('stat_total_projects')}
            value={stats.totalProjects}
            subtitle={t('stat_projects_created')}
            color="blue"
          />
          <StatCard
            icon={BarChart3}
            title={t('stat_analyses_completed')}
            value={stats.completedAnalyses}
            subtitle={t('stat_rooms_analyzed')}
            color="green"
          />
          <StatCard
            icon={Palette}
            title={t('stat_designs_created')}
            value={stats.savedDesigns}
            subtitle={t('stat_ready_solutions')}
            color="purple"
          />
          <StatCard
            icon={DollarSign}
            title={t('stat_total_budget')}
            value={`${(stats.totalBudget / 1000).toFixed(0)}к ₽`}
            subtitle={t('stat_max_budget')}
            color="green"
          />
        </div>

        {/* Информационное сообщение о сохранении проектов */}
        {projects.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>{t('dashboard_local_storage_message')}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
            <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-6 text-center border-b-2 transition-all duration-200 ${
                    activeTab === item.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <div className={`text-sm font-medium ${
                    activeTab === item.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {item.label}
            </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden lg:block">
                    {item.description}
          </div>
                </button>
              )
            })}
              </div>
            </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {activeTab === 'analyzer' && (
            <div className="p-6">
              <RenovationAssistant 
                userId={userId}
              />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="p-6">
              <ProjectManager 
                userId={userId} 
                refreshProjects={refreshProjects}
              />
                    </div>
                  )}
          
          {activeTab === 'generator' && (
            <div className="p-6">
              <ImageGenerator />
                </div>
              )}
          
          {activeTab === 'designs' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('empty_saved_designs_title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('empty_saved_designs_description')}
                </p>
                      </div>
                        </div>
                      )}
          
          {activeTab === 'chat' && (
            <div className="p-6">
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('empty_ai_consultant_title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('empty_ai_consultant_description')}
                    </p>
                  </div>
                  </div>
                )}

          {activeTab === 'settings' && (
            <div className="p-6">
        <div className="space-y-6">
            <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {t('settings_profile_title')}
            </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings_preferred_style')}
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>{t('style_modern')}</option>
                        <option>{t('style_scandinavian')}</option>
                        <option>{t('style_minimalist')}</option>
                        <option>{t('style_classic')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings_default_budget')}
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>{t('budget_50_100k')}</option>
                        <option>{t('budget_100_200k')}</option>
                        <option>{t('budget_200_500k')}</option>
                        <option>{t('budget_500k_plus')}</option>
                      </select>
                    </div>
                    </div>
                  </div>
                  
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {t('settings_notifications')}
            </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {t('settings_analysis_notifications')}
                </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {t('settings_weekly_summary')}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {t('settings_new_style_suggestions')}
                      </span>
                    </label>
                </div>
                  </div>
                  </div>
                </div>
              )}
            </div>

        {/* Quick Actions Panel */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard_quick_actions')}
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => setActiveTab('analyzer')}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                variant={activeTab === 'analyzer' ? 'default' : 'outline'}
              >
                <Upload className="w-6 h-6" />
                <span>{t('dashboard_analyze_new_room')}</span>
              </Button>
              
              <Button 
                onClick={() => setActiveTab('projects')}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                variant={activeTab === 'projects' ? 'default' : 'outline'}
              >
                <FolderOpen className="w-6 h-6" />
                <span>{t('dashboard_view_projects')}</span>
              </Button>
              
              <Button 
                onClick={() => setActiveTab('generator')}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                variant={activeTab === 'generator' ? 'default' : 'outline'}
              >
                <ImageIcon className="w-6 h-6" />
                <span>{t('dashboard_create_visualization')}</span>
              </Button>
              </div>
          </Card>
            </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('dashboard_copyright')}</p>
            </div>
          </div>
    </div>
  )
} 