'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit3, 
  Trash2,
  Download,
  Share,
  Image,
  BarChart3,
  Palette,
  Home,
  Clock,
  X
} from 'lucide-react'
import { Project, RoomAnalysis } from '../../../../lib/types'
import { useAppStore } from '../../../../lib/store'
import { useTranslations } from '../../../../lib/translations'

interface ProjectManagerProps {
  userId?: string
  refreshProjects?: number
}

export default function ProjectManager({ userId = 'demo_user', refreshProjects }: ProjectManagerProps) {
  const { t } = useTranslations()
  // Используем Zustand store вместо локального состояния
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject,
    currentProject,
    setCurrentProject 
  } = useAppStore()
  
  const [premiumProjects, setPremiumProjects] = useState<any[]>([])
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'draft' | 'analysis' | 'design' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'details'>('grid')

  // Загружаем проекты от Premium Designer
  useEffect(() => {
    const loadPremiumProjects = () => {
      try {
        const saved = localStorage.getItem('red_ai_projects')
        if (saved) {
          setPremiumProjects(JSON.parse(saved))
        }
      } catch (error) {
        console.error('Error loading premium projects:', error)
      }
    }
    
    loadPremiumProjects()
  }, [refreshProjects])
  
  // Sync selectedProject with currentProject from store
  // Убираем автоматическое открытие детального вида после анализа
  useEffect(() => {
    // Больше не открываем автоматически детальный вид
    // Пользователь должен сам выбрать проект для просмотра
  }, [currentProject, selectedProject])

  // Создание нового проекта через store
  const createProject = async (projectData: Partial<Project>) => {
    try {
      // Создаем проект в localStorage через Zustand (глобально для всех пользователей)
      addProject({
        name: projectData.name || 'Новый проект',
        description: projectData.description || '',
        userId: 'all', // Глобальные проекты доступны всем пользователям
        status: projectData.status || 'draft',
        image: projectData.image,
        generatedImages: projectData.generatedImages || [],
        budget: projectData.budget || { min: 50000, max: 200000 },
        preferredStyles: projectData.preferredStyles || ['modern'],
        restrictions: projectData.restrictions || [],
        roomAnalysis: projectData.roomAnalysis || undefined,
        designRecommendation: projectData.designRecommendation || undefined,
        threeDModel: projectData.threeDModel || undefined,
        pdfReport: projectData.pdfReport || undefined,
        shoppingList: projectData.shoppingList || undefined
      })
      
      setShowCreateModal(false)
      
      // Также синхронизируем с API для совместимости
      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...projectData })
        })
      } catch (apiError) {
        console.log('API sync failed, but project saved locally:', apiError)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  // Удаление проекта
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return
    
    try {
      // Удаляем из localStorage
      deleteProject(projectId)
      
      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
      }
      
      // Также удаляем из API для совместимости
      try {
        await fetch(`/api/projects?projectId=${projectId}`, {
          method: 'DELETE'
        })
      } catch (apiError) {
        console.log('API sync failed, but project deleted locally:', apiError)
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  // Экспорт Premium проекта
  const exportPremiumProject = async (project: any) => {
    try {
      setIsLoading(true)
      
      const exportData = {
        image: project.designData?.image,
        settings: project.designData?.settings,
        analysis: project.designData?.roomAnalysis,
        timestamp: new Date(project.createdAt).toLocaleString('ru-RU'),
        projectName: project.name
      }

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'premium_design',
          data: exportData
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_Design.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Удаление Premium проекта
  const deletePremiumProject = (projectId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот дизайн?')) return
    
    try {
      const updated = premiumProjects.filter(p => p.id !== projectId)
      setPremiumProjects(updated)
      localStorage.setItem('red_ai_projects', JSON.stringify(updated))
      
      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
      }
    } catch (error) {
      console.error('Error deleting premium project:', error)
    }
  }

  const exportProject = async (project: Project) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          includeShoppingList: true,
          includeAnalysis: true,
          include3D: false
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // В реальном приложении здесь был бы скачивание PDF
        console.log('PDF export successful:', data)
        
        // Создаем blob для демонстрации
        const htmlBlob = new Blob([data.htmlPreview], { type: 'text/html' })
        const url = URL.createObjectURL(htmlBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${project.name}.html`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      analysis: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      design: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const getStatusText = (status: string) => {
    const statusKeys = {
      draft: 'project_status_draft',
      analysis: 'project_status_analysis',
      design: 'project_status_design',
      review: 'project_status_review',
      completed: 'project_status_completed'
    }
    return t(statusKeys[status as keyof typeof statusKeys] as any) || status
  }

  const getRoomTypeDisplay = (type: string) => {
    const roomKeys = {
      living_room: 'room_living_room',
      bedroom: 'room_bedroom',
      kitchen: 'room_kitchen',
      bathroom: 'room_bathroom',
      office: 'room_office',
      dining_room: 'room_dining_room',
      hallway: 'room_hallway'
    }
    return t(roomKeys[type as keyof typeof roomKeys] as any) || type
  }

  // Рендер карточки Premium проекта
  const renderPremiumProjectCard = (project: any) => (
    <Card key={project.id} className="p-6 hover:shadow-lg transition-all duration-200 border border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
              💎 Premium Design
            </span>
            <span className="text-xs text-gray-500">
              {new Date(project.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {project.designData?.settings?.prompt || 'Премиум дизайн интерьера'}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              {project.designData?.settings?.roomType}
            </span>
            <span className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              {project.designData?.settings?.style}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {project.designData?.metadata?.estimatedCost}
            </span>
          </div>
        </div>
        
        {project.designData?.image?.url && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 ml-4">
            <img 
              src={project.designData.image.url} 
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-purple-200 dark:border-purple-700">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProject(project)}
            className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Eye className="h-4 w-4 mr-1" />
            Просмотр
          </Button>
          
          {project.exportData?.canExportPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportPremiumProject(project)}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => deletePremiumProject(project.id)}
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )

  const renderProjectCard = (project: Project) => (
    <Card key={project.id} className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {project.description}
          </p>
          
          {/* Room Analysis Summary */}
          {project.roomAnalysis && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {getRoomTypeDisplay(project.roomAnalysis.roomType)}
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {project.roomAnalysis.dimensions.area.toFixed(1)}м²
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
                <span>Проблем: {project.roomAnalysis.problems.length}</span>
                <span>Возможностей: {project.roomAnalysis.opportunities.length}</span>
              </div>
            </div>
          )}
          
          {/* Status and Meta Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(project.updatedAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">
                {project.budget.min.toLocaleString('ru-RU')} - {project.budget.max.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>
        
        {/* Project Image */}
        {(project.image || project.roomAnalysis?.originalImage || project.generatedImages?.[0]) && (
          <div className="ml-4 flex-shrink-0">
            <img 
              src={project.image || project.roomAnalysis?.originalImage || project.generatedImages?.[0]} 
              alt="Project preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProject(project)}
            className="flex items-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>Подробно</span>
          </Button>
          
          {project.roomAnalysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportProject(project)}
              className="flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>PDF</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Edit functionality */}}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProject(project.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  )

  // Enhanced detailed view for projects with room analysis
  const renderDetailedView = (project: Project) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Room Analysis Details */}
          {project.roomAnalysis && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Анализ комнаты
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h4 className="font-medium mb-2">Исходное изображение</h4>
                  <img 
                    src={project.image || project.roomAnalysis.originalImage} 
                    alt="Original room"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
                
                {/* Analysis Data */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Основные характеристики</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Тип комнаты:</span>
                        <span className="font-medium">{getRoomTypeDisplay(project.roomAnalysis.roomType)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Площадь:</span>
                        <span className="font-medium">{project.roomAnalysis.dimensions.area.toFixed(1)} м²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Размеры:</span>
                        <span className="font-medium">{project.roomAnalysis.dimensions.width}×{project.roomAnalysis.dimensions.height} м</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Текущий стиль:</span>
                        <span className="font-medium">{project.roomAnalysis.currentStyle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Освещение:</span>
                        <span className="font-medium">{project.roomAnalysis.lighting}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color Palette */}
                  <div>
                    <h4 className="font-medium mb-2">Цветовая палитра</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.roomAnalysis.colors.map((color, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Problems and Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Выявленные проблемы</h4>
                  <ul className="space-y-1 text-sm">
                    {project.roomAnalysis.problems.map((problem, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Возможности улучшения</h4>
                  <ul className="space-y-1 text-sm">
                    {project.roomAnalysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Design Recommendation */}
          {project.designRecommendation && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-600" />
                Рекомендации по дизайну
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <h4 className="font-medium mb-2">Предлагаемая мебель</h4>
                  <div className="space-y-2">
                    {project.designRecommendation.furniture.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                        <span className="font-medium">{item.price.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Цветовая схема</h4>
                  <div className="space-y-2">
                    {Object.entries(project.designRecommendation.colorPalette).map(([key, color]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key}:</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-mono">{color}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Generated Images */}
          {project.generatedImages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2 text-green-600" />
                Сгенерированные дизайны
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.generatedImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Generated design ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => exportProject(project)}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Экспорт в PDF</span>
            </Button>
            <Button
              onClick={() => setSelectedProject(null)}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Загрузка проектов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FolderOpen className="w-6 h-6 mr-2" />
            Мои проекты
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {projects.length} проектов • {filteredProjects.length} показано
          </p>
          {projects.length > 0 && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✅ Все проекты сохраняются постоянно и не удаляются при выходе из аккаунта
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Новый проект</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('project_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('project_all_statuses')}</option>
            <option value="draft">{t('project_drafts')}</option>
            <option value="analysis">{t('project_filter_analysis')}</option>
            <option value="design">{t('project_filter_design')}</option>
            <option value="completed">{t('project_completed')}</option>
          </select>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="space-y-8">
        {/* Premium Projects Section */}
        {premiumProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-purple-600">💎</span>
              Premium Дизайны ({premiumProjects.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumProjects.map(renderPremiumProjectCard)}
            </div>
          </div>
        )}
        
        {/* Regular Projects Section */}
        {projects.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Обычные проекты ({filteredProjects.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(renderProjectCard)}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {premiumProjects.length === 0 && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Проектов не найдено
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Создайте свой первый проект или измените фильтры поиска
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать проект
            </Button>
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedProject && renderDetailedView(selectedProject)}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Создать новый проект
              </h3>
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              createProject({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                status: 'draft',
                generatedImages: [],
                budget: { min: 50000, max: 200000 },
                preferredStyles: ['modern'],
                restrictions: []
              })
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Название проекта
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Например: Дизайн гостиной"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Описание
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Опишите ваши идеи и пожелания..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Отмена
                </Button>
                <Button type="submit">
                  Создать проект
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 