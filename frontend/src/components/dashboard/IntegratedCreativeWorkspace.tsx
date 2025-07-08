'use client'

import React, { useState, useRef } from 'react'
import { 
  Home, 
  FolderOpen, 
  Wand2, 
  Upload, 
  Download, 
  Settings, 
  Box, 
  Camera,
  Save,
  Eye,
  Sparkles,
  Search,
  FileDown,
  ExternalLink,
  Loader2,
  X,
  ChevronRight,
  Zap,
  Target,
  MessageCircle
} from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card } from '../../../../components/ui/card'
import RenovationAssistant from './RenovationAssistant'
import ProjectManager from './ProjectManager'
import { AuthService } from '../../../../lib/auth'

interface GeneratedDesign {
  id: string
  imageUrl: string
  prompt: string
  referenceImage?: string
  style: string
  timestamp: string
  furniture: FurnitureRecommendation[]
  pinterestStyles: PinterestStyle[]
  threeDModel?: string
}

interface FurnitureRecommendation {
  id: string
  name: string
  price: number
  store: 'IKEA' | 'Pinduoduo'
  imageUrl: string
  productUrl: string
  category: string
}

interface PinterestStyle {
  id: string
  title: string
  imageUrl: string
  source: string
  pinterestUrl: string
}

export default function IntegratedCreativeWorkspace() {
  const [activeSection, setActiveSection] = useState<'analyzer' | 'projects' | 'dalle'>('analyzer')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState(AuthService.getCurrentUser())
  
  // Stable Diffusion XL Generator States
  const [dallePrompt, setDallePrompt] = useState('')
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generate3D, setGenerate3D] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [generatedDesigns, setGeneratedDesigns] = useState<GeneratedDesign[]>([])
  const [selectedDesign, setSelectedDesign] = useState<GeneratedDesign | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const styles = [
    { id: 'modern', name: 'Современный', emoji: '🏢' },
    { id: 'minimalist', name: 'Минимализм', emoji: '⚪' },
    { id: 'scandinavian', name: 'Скандинавский', emoji: '🌲' },
    { id: 'industrial', name: 'Лофт', emoji: '🏭' },
    { id: 'bohemian', name: 'Бохо', emoji: '🌸' },
    { id: 'classic', name: 'Классический', emoji: '🏛️' }
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateDesign = async () => {
    if (!dallePrompt.trim() && !referenceImage) return
    
    setIsGenerating(true)
    
    try {
      // Simulate Stable Diffusion XL API call with reference image merge
      const response = await fetch('/api/dalle-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: dallePrompt,
          referenceImage,
          style: selectedStyle,
          generate3D
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const newDesign: GeneratedDesign = {
          id: `design_${Date.now()}`,
          imageUrl: data.imageUrl,
          prompt: dallePrompt,
          referenceImage: referenceImage || undefined,
          style: selectedStyle,
          timestamp: new Date().toISOString(),
          furniture: data.furniture || [],
          pinterestStyles: data.pinterestStyles || [],
          threeDModel: generate3D ? data.threeDModel : undefined
        }
        
        setGeneratedDesigns(prev => [newDesign, ...prev])
        setSelectedDesign(newDesign)
      }
    } catch (error) {
      console.error('Design generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadAllAssets = async (design: GeneratedDesign) => {
    try {
      const response = await fetch('/api/download-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId: design.id })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Open PDF in new window
        const previewWindow = window.open('', '_blank')
        if (previewWindow) {
          previewWindow.document.write(data.pdfContent)
          previewWindow.document.close()
        }
      }
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const SidebarNavigation = () => (
    <div className={`fixed left-0 top-0 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 z-40 ${
      sidebarCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                RED AI Studio
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Creative Workspace</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem
            icon={MessageCircle}
            label="ИИ Помощник"
            active={activeSection === 'analyzer'}
            onClick={() => setActiveSection('analyzer')}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={FolderOpen}
            label="My Projects"
            active={activeSection === 'projects'}
            onClick={() => setActiveSection('projects')}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={Wand2}
                            label="Stable Diffusion XL Generator"
            active={activeSection === 'dalle'}
            onClick={() => setActiveSection('dalle')}
            collapsed={sidebarCollapsed}
            badge="New"
          />
        </nav>

        {/* User Profile */}
        {!sidebarCollapsed && user && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Creative Designer
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute top-4 -right-3 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
      >
        <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
      </Button>
    </div>
  )

  const NavItem = ({ icon: Icon, label, active, onClick, collapsed, badge }: {
    icon: React.ElementType
    label: string
    active: boolean
    onClick: () => void
    collapsed: boolean
    badge?: string
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left font-medium">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-medium">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  )

  const DALLEGenerator = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Stable Diffusion XL Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create stunning interior designs with AI
          </p>
        </div>
      </div>

      {/* Generation Interface */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-700">
        <div className="space-y-6">
          {/* Reference Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Reference Image (Optional)
            </label>
            
            {referenceImage ? (
              <div className="relative inline-block">
                <img
                  src={referenceImage}
                  alt="Reference"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-purple-200 dark:border-purple-700"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0"
                  onClick={() => setReferenceImage(null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Upload Image
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Text Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Describe your dream interior
            </label>
            <textarea
              value={dallePrompt}
              onChange={(e) => setDallePrompt(e.target.value)}
              placeholder="A modern living room with minimalist furniture, large windows, and natural lighting..."
              className="w-full h-24 p-4 border border-purple-200 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-800 dark:text-white resize-none"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
            />
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{style.emoji}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Generation Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-700">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Generate 3D Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create interactive 3D model</p>
            </div>
            <button
              onClick={() => setGenerate3D(!generate3D)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                generate3D ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  generate3D ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateDesign}
            disabled={isGenerating || (!dallePrompt.trim() && !referenceImage)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-medium"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Design
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Designs */}
      {generatedDesigns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Generated Designs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedDesigns.map((design) => (
              <DesignCard key={design.id} design={design} onSelect={(design) => setSelectedDesign(design)} />
            ))}
          </div>
        </div>
      )}

      {/* Selected Design Details */}
      {selectedDesign && (
        <SelectedDesignDetails 
          design={selectedDesign} 
          onDownloadAll={downloadAllAssets}
        />
      )}
    </div>
  )

  interface DesignCardProps {
    design: GeneratedDesign
    onSelect: (design: GeneratedDesign) => void
  }

  const DesignCard: React.FC<DesignCardProps> = ({ design, onSelect }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onSelect(design)}>
      <div className="aspect-video bg-gray-100 dark:bg-gray-800">
        <img
          src={design.imageUrl}
          alt={design.prompt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
          {design.prompt}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(design.timestamp).toLocaleDateString()}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
            {design.style}
          </span>
          {design.threeDModel && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              3D Available
            </span>
          )}
        </div>
      </div>
    </Card>
  )

  interface SelectedDesignDetailsProps {
    design: GeneratedDesign
    onDownloadAll: (design: GeneratedDesign) => void
  }

  const SelectedDesignDetails: React.FC<SelectedDesignDetailsProps> = ({ 
    design, 
    onDownloadAll
  }) => (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Design Details
          </h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Similar Styles
            </Button>
            {design.threeDModel && (
              <Button variant="outline" size="sm">
                <Box className="w-4 h-4 mr-2" />
                View 3D
              </Button>
            )}
            <Button onClick={() => onDownloadAll(design)} className="bg-green-600 hover:bg-green-700">
              <FileDown className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={design.imageUrl}
              alt={design.prompt}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommended Furniture</h4>
              <div className="space-y-3">
                {design.furniture.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white">{item.name}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.store}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        ${item.price}
                      </p>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20">
      <SidebarNavigation />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        <div className="p-6">
                      {activeSection === 'analyzer' && <RenovationAssistant />}
          {activeSection === 'projects' && <ProjectManager />}
          {activeSection === 'dalle' && <DALLEGenerator />}
        </div>
      </main>
    </div>
  )
} 