'use client'

import React, { useState } from 'react'
import { Upload, FileImage, X, Sparkles, Settings, Download, Heart, ZoomIn, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useTranslations } from '@/lib/translations'

interface DesignResult {
  designImage: string
  suggestions: {
    furniture: string[]
    colors: string[]
    lighting: string[]
    accessories: string[]
  }
  parameters: {
    designType: string
    roomType: string
    budget: string
  }
}

export function SimpleUpload() {
  const { t } = useTranslations()
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [designResult, setDesignResult] = useState<DesignResult | null>(null)
  const [designParameters, setDesignParameters] = useState({
    designType: 'modern',
    roomType: 'living room',
    budget: 'medium'
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFileUpload(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFileUpload(file)
    }
  }

  const handleFileUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('ai_generator_invalid_file'))
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert(t('ai_generator_file_too_large'))
      return
    }

    setUploadedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setDesignResult(null)
  }

  const generateDesign = async () => {
    if (!uploadedFile) {
      alert(t('ai_generator_upload_first'))
      return
    }

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append('image', uploadedFile)
      formData.append('designType', designParameters.designType)
      formData.append('roomType', designParameters.roomType)
      formData.append('budget', designParameters.budget)

      const response = await fetch('/api/generate-design', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate design')
      }

      const result = await response.json()
      setDesignResult(result)
    } catch (error) {
      console.error('Error generating design:', error)
      alert('Failed to generate design. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadDesign = () => {
    if (designResult?.designImage) {
      const link = document.createElement('a')
      link.href = designResult.designImage
      link.download = 'ai-design-result.png'
      link.click()
    }
  }

  const saveToFavorites = async () => {
    if (!designResult) return

    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designImage: designResult.designImage,
          suggestions: designResult.suggestions,
          parameters: designResult.parameters,
          userId: 'default', // In production, get from auth context
          isFavorite: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save design')
      }

      const result = await response.json()
      alert('Design saved to favorites successfully!')
    } catch (error) {
      console.error('Error saving design:', error)
      alert('Failed to save design. Please try again.')
    }
  }

  // Fullscreen Modal Component
  const FullscreenModal = () => {
    if (!showFullscreen || !previewUrl) return null

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        onClick={() => setShowFullscreen(false)}
      >
        <div className="relative max-w-7xl max-h-full">
          <Button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-none"
            size="icon"
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={previewUrl}
            alt="Floor plan fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FullscreenModal />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {t('ai_generator_title')}
          </CardTitle>
          <CardDescription>
            {t('ai_generator_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Instructions */}
          {!uploadedFile && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                {t('ai_generator_how_it_works')}
              </h4>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start">
                  <span className="font-semibold mr-2 text-blue-600">1.</span>
                  <span>{t('ai_generator_step1')}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold mr-2 text-blue-600">2.</span>
                  <span>{t('ai_generator_step2')}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold mr-2 text-blue-600">3.</span>
                  <span>{t('ai_generator_step3')}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Upload Section */}
          {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileImage className="mx-auto h-16 w-16 text-blue-500 mb-4" />
            <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                📐 {t('ai_generator_upload_button')}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {t('ai_generator_upload_description')}<br/>
                <span className="text-xs">{t('ai_generator_file_format')}</span>
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-5 w-5" />
                  {t('ai_generator_select_file')}
              </label>
            </Button>
            </div>
          ) : (
            /* Uploaded File Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {t('ai_generator_uploaded_plan')}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('ai_generator_delete')}
                </Button>
              </div>
              
              <div className="relative bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                {previewUrl && (
                  <>
                    <div className="relative w-full h-96">
                      <Image
                        src={previewUrl}
                        alt={uploadedFile.name}
                        fill
                        className="object-contain"
                      />
          </div>

                    {/* Image overlay controls */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        onClick={() => setShowFullscreen(true)}
                        size="icon"
                        className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* File info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{uploadedFile.name}</p>
                          <p className="text-xs opacity-75">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                    </div>
                    <Button
                          onClick={() => setShowFullscreen(true)}
                      variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 px-3 py-2"
                    >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('ai_generator_fullscreen')}
                    </Button>
                  </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Design Parameters */}
          {uploadedFile && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('ai_generator_design_style')}
                </label>
                <select
                  value={designParameters.designType}
                  onChange={(e) => setDesignParameters(prev => ({ ...prev, designType: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="modern">{t('ai_generator_style_modern')}</option>
                  <option value="minimalist">{t('ai_generator_style_minimalist')}</option>
                  <option value="scandinavian">{t('ai_generator_style_scandinavian')}</option>
                  <option value="industrial">{t('ai_generator_style_industrial')}</option>
                  <option value="bohemian">{t('ai_generator_style_bohemian')}</option>
                  <option value="traditional">{t('ai_generator_style_traditional')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('ai_generator_room_type')}
                </label>
                <select
                  value={designParameters.roomType}
                  onChange={(e) => setDesignParameters(prev => ({ ...prev, roomType: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="living room">{t('ai_generator_room_living')}</option>
                  <option value="bedroom">{t('ai_generator_room_bedroom')}</option>
                  <option value="kitchen">{t('ai_generator_room_kitchen')}</option>
                  <option value="bathroom">{t('ai_generator_room_bathroom')}</option>
                  <option value="office">{t('ai_generator_room_office')}</option>
                  <option value="dining room">{t('ai_generator_room_dining')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('ai_generator_budget_level')}
                </label>
                <select
                  value={designParameters.budget}
                  onChange={(e) => setDesignParameters(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="low">{t('ai_generator_budget_low')}</option>
                  <option value="medium">{t('ai_generator_budget_medium')}</option>
                  <option value="high">{t('ai_generator_budget_high')}</option>
                </select>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {uploadedFile && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  🎨 {t('ai_generator_ready_to_generate')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('ai_generator_ready_description')}
                </p>
              </div>
              <Button
                onClick={generateDesign}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Settings className="mr-3 h-5 w-5 animate-spin" />
                    {t('ai_generator_generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    {t('ai_generator_generate_button')}
                  </>
                )}
              </Button>
              {!isGenerating && (
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
                  💡 {t('ai_generator_openai_note')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Design Results */}
      {designResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('ai_generator_generated_design')}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={saveToFavorites} className="px-3 py-2">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={downloadDesign} className="px-3 py-2">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              {t('ai_generator_generated_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generated Image */}
              <div className="space-y-4">
                <div className="relative w-full h-80 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <Image
                    src={designResult.designImage}
                    alt="Generated interior design"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>{t('ai_generator_style_label')}:</strong> {designResult.parameters.designType}</p>
                  <p><strong>{t('ai_generator_room_label')}:</strong> {designResult.parameters.roomType}</p>
                  <p><strong>{t('ai_generator_budget_label')}:</strong> {designResult.parameters.budget}</p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    {t('ai_generator_furniture_recommendations')}
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {designResult.suggestions.furniture?.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    {t('ai_generator_color_palette')}
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {designResult.suggestions.colors?.map((color, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                        {color}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    {t('ai_generator_lighting_suggestions')}
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {designResult.suggestions.lighting?.map((light, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                        {light}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    {t('ai_generator_accessories_decor')}
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {designResult.suggestions.accessories?.map((accessory, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        {accessory}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 