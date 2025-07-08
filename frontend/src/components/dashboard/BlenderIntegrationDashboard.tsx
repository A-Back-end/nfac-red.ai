'use client'

import React, { useState, useRef } from 'react'
import { 
  Upload, 
  Camera, 
  Wand2, 
  Download, 
  Eye, 
  Save, 
  RotateCcw, 
  Send, 
  X, 
  Loader2, 
  Box, 
  FileDown,
  Settings,
  Zap,
  Target,
  ArrowRight,
  CheckCircle,
  Play,
  Code,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RoomAnalysis, DesignRecommendation, Project, DetectedFurniture } from '@/lib/types'
import ThreeDViewer from './ThreeDViewer'
import { useTranslations } from '@/lib/translations'

export default function BlenderIntegrationDashboard() {
  const { t } = useTranslations()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [roomAnalysis, setRoomAnalysis] = useState<RoomAnalysis | null>(null)
  const [isGenerating3D, setIsGenerating3D] = useState(false)
  const [blenderScript, setBlenderScript] = useState<string>('')
  const [claudeInstructions, setClaudeInstructions] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'generate' | 'complete'>('upload')
  const [generatedFiles, setGeneratedFiles] = useState<{
    script: string
    instructions: string
    metadata: any
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setCurrentStep('analyze')
    }
  }

  const analyzeRoom = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setCurrentStep('analyze')

    try {
      // Простая заглушка анализа для демо
      // Используйте ИИ помощника по ремонту для получения рекомендаций
      const mockAnalysis = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        originalImage: URL.createObjectURL(uploadedFile),
        roomType: 'living_room' as const,
        currentStyle: 'modern',
        dimensions: { width: 4, height: 3, area: 12 },
        lighting: 'mixed' as const,
        colors: ['#F5F5F5', '#8B4513', '#2F4F4F'],
        furniture: [
          { 
            type: 'sofa', 
            position: { x: 2, y: 1.5 }, 
            size: { width: 2, height: 0.8 },
            condition: 'good' as const,
            suggestions: ['Добавить подушки', 'Изменить положение']
          },
          { 
            type: 'coffee_table', 
            position: { x: 2, y: 2.5 }, 
            size: { width: 1, height: 0.4 },
            condition: 'good' as const,
            suggestions: ['Заменить на более современный']
          }
        ],
        problems: ['Недостаточное освещение'],
        opportunities: ['Добавить декоративные элементы']
      }
      
      setRoomAnalysis(mockAnalysis)
      setCurrentStep('generate')
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generate3DModel = async () => {
    if (!roomAnalysis) return

    setIsGenerating3D(true)

    try {
      // 1. Генерируем Claude инструкции
      const instructions = generateClaudeInstructions(roomAnalysis)
      setClaudeInstructions(instructions)

      // 2. Отправляем в Claude API для генерации Blender скрипта
      const response = await fetch('/api/claude-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          instructions,
          roomAnalysis 
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setBlenderScript(data.blenderScript)
        setGeneratedFiles({
          script: data.blenderScript,
          instructions,
          metadata: {
            roomType: roomAnalysis.roomType,
            style: roomAnalysis.currentStyle,
            dimensions: roomAnalysis.dimensions,
            generated: new Date().toISOString()
          }
        })
        setCurrentStep('complete')
      }
    } catch (error) {
      console.error('3D Generation error:', error)
    } finally {
      setIsGenerating3D(false)
    }
  }

  const generateClaudeInstructions = (analysis: RoomAnalysis): string => {
    return `Ты — ассистент по 3D-дизайну интерьеров, встроенный в проект RED AI. Твоя задача — анализировать изображения интерьера, понимать контекст помещения и генерировать инструкции для Blender.

Create a 3D model of a ${analysis.currentStyle} ${analysis.roomType} in Blender with the following specifications:

ROOM DIMENSIONS:
- Width: ${analysis.dimensions.width}m
- Height: ${analysis.dimensions.height}m  
- Area: ${analysis.dimensions.area}m²

FURNITURE PLACEMENT:
${analysis.furniture?.map(item => `- ${item.type}: (${item.position.x}, ${item.position.y}) (condition: ${item.condition})`).join('\n') || '- sofa: центр комнаты\n- coffee_table: перед диваном\n- tv_stand: у стены'}

LIGHTING SETUP:
- ceiling_light: центр потолка
- ambient_light: естественное освещение
- accent_light: декоративное освещение

MATERIALS:
- пол: ламинат
- стены: краска  
- потолок: штукатурка

COLOR PALETTE:
${analysis.colors?.join(', ') || '#F5F5F5, #8B4513, #2F4F4F'}

STYLE: ${analysis.currentStyle}

Please generate detailed Blender Python script (bpy) that creates this room with proper lighting, materials, and furniture placement.`
  }

  const downloadAllAssets = () => {
    if (!generatedFiles) return

    // Создаем ZIP файл с ассетами
    const timestamp = Date.now()
    const roomName = `${roomAnalysis?.roomType}_${roomAnalysis?.currentStyle}_${timestamp}`

    // Создаем текстовые файлы для скачивания
    const files = [
      {
        name: `${roomName}.py`,
        content: generatedFiles.script,
        type: 'text/python'
      },
      {
        name: `${roomName}_instructions.txt`,
        content: generatedFiles.instructions,
        type: 'text/plain'
      },
      {
        name: `${roomName}_info.json`,
        content: JSON.stringify(generatedFiles.metadata, null, 2),
        type: 'application/json'
      }
    ]

    // Скачиваем каждый файл
    files.forEach(file => {
      const blob = new Blob([file.content], { type: file.type })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  const resetWorkflow = () => {
    setUploadedFile(null)
    setRoomAnalysis(null)
    setBlenderScript('')
    setClaudeInstructions('')
    setGeneratedFiles(null)
    setCurrentStep('upload')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏠 RED AI - 3D Blender Integration
          </h1>
          <p className="text-gray-300 text-lg">
            Анализ интерьера → Claude AI → Blender Python Script
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="p-6 bg-white/10 backdrop-blur border-purple-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-purple-400' : (currentStep === 'analyze' || currentStep === 'generate' || currentStep === 'complete') ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-purple-500' : (currentStep === 'analyze' || currentStep === 'generate' || currentStep === 'complete') ? 'bg-green-500' : 'bg-gray-600'}`}>
                {(currentStep === 'analyze' || currentStep === 'generate' || currentStep === 'complete') ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </div>
              <span className="font-medium">{t('blender_step_upload')}</span>
            </div>

            <ArrowRight className="text-gray-400" />

            <div className={`flex items-center space-x-2 ${currentStep === 'analyze' ? 'text-purple-400' : ['generate', 'complete'].includes(currentStep) ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'analyze' ? 'bg-purple-500' : ['generate', 'complete'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-600'}`}>
                {['generate', 'complete'].includes(currentStep) ? <CheckCircle className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </div>
              <span className="font-medium">{t('blender_step_analyze')}</span>
            </div>

            <ArrowRight className="text-gray-400" />

            <div className={`flex items-center space-x-2 ${currentStep === 'generate' ? 'text-purple-400' : currentStep === 'complete' ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'generate' ? 'bg-purple-500' : currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-600'}`}>
                {currentStep === 'complete' ? <CheckCircle className="w-5 h-5" /> : <Box className="w-5 h-5" />}
              </div>
              <span className="font-medium">{t('blender_step_generate')}</span>
            </div>

            <ArrowRight className="text-gray-400" />

            <div className={`flex items-center space-x-2 ${currentStep === 'complete' ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-600'}`}>
                <FileDown className="w-5 h-5" />
              </div>
              <span className="font-medium">{t('blender_step_download')}</span>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input & Analysis */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="p-6 bg-white/10 backdrop-blur border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">{t('blender_file_upload')}</h3>
              
              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center cursor-pointer hover:border-purple-300 transition-colors"
                >
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">{t('blender_upload_image_prompt')}</p>
                  <p className="text-gray-400 text-sm">{t('blender_upload_image_hint')}</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Uploaded room"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    onClick={() => setUploadedFile(null)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploadedFile && !roomAnalysis && (
                <Button
                  onClick={analyzeRoom}
                  disabled={isAnalyzing}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('blender_analyzing_text')}
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      {t('blender_analyze_room')}
                    </>
                  )}
                </Button>
              )}
            </Card>

            {/* Room Analysis Results */}
            {roomAnalysis && (
              <Card className="p-6 bg-white/10 backdrop-blur border-green-500/30">
                <h3 className="text-xl font-semibold text-white mb-4">{t('blender_room_analysis')}</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">{t('blender_room_type')}</p>
                      <p className="text-white font-medium">{roomAnalysis.roomType}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">{t('blender_style')}</p>
                      <p className="text-white font-medium">{roomAnalysis.currentStyle}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">{t('blender_dimensions')}</p>
                      <p className="text-white font-medium">
                        {roomAnalysis.dimensions.width}×{roomAnalysis.dimensions.height}м
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">{t('blender_area')}</p>
                      <p className="text-white font-medium">{roomAnalysis.dimensions.area} м²</p>
                    </div>
                  </div>

                  {roomAnalysis.furniture && roomAnalysis.furniture.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">{t('blender_detected_furniture')}</p>
                      <div className="space-y-1">
                        {roomAnalysis.furniture.map((item, index) => (
                          <div key={index} className="text-white text-sm">
                            • {item.type} - ({item.position.x}, {item.position.y})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={generate3DModel}
                    disabled={isGenerating3D}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isGenerating3D ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('blender_generating_3d_text')}
                      </>
                    ) : (
                      <>
                        <Box className="w-5 h-5 mr-2" />
                        {t('blender_generate_3d_model')}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - 3D Viewer & Results */}
          <div className="space-y-6">
            {/* 3D Viewer */}
            {roomAnalysis && (
              <Card className="p-6 bg-white/10 backdrop-blur border-blue-500/30">
                <h3 className="text-xl font-semibold text-white mb-4">{t('blender_3d_visualization')}</h3>
                <div className="h-64 bg-black/20 rounded-lg overflow-hidden">
                  <ThreeDViewer
                    roomDimensions={roomAnalysis.dimensions}
                    furniture={[] as any}
                    colorPalette={{ primary: roomAnalysis.colors?.[0] || '#F5F5F5', secondary: roomAnalysis.colors?.[1] || '#8B4513', accent: roomAnalysis.colors?.[2] || '#2F4F4F', neutral: '#FFFFFF' }}
                  />
                </div>
              </Card>
            )}

            {/* Claude Instructions */}
            {claudeInstructions && (
              <Card className="p-6 bg-white/10 backdrop-blur border-yellow-500/30">
                <h3 className="text-xl font-semibold text-white mb-4">{t('blender_claude_instructions')}</h3>
                <div className="bg-black/30 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-gray-300 text-xs whitespace-pre-wrap">{claudeInstructions}</pre>
                </div>
              </Card>
            )}

            {/* Generated Blender Script */}
            {blenderScript && (
              <Card className="p-6 bg-white/10 backdrop-blur border-green-500/30">
                <h3 className="text-xl font-semibold text-white mb-4">{t('blender_blender_script')}</h3>
                <div className="bg-black/30 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-green-300 text-xs font-mono">{blenderScript.substring(0, 500)}...</pre>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={downloadAllAssets}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    {t('blender_download_all_assets')}
                  </Button>
                  
                  <Button
                    onClick={resetWorkflow}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Instructions */}
        <Card className="p-6 bg-white/5 backdrop-blur border-gray-600/30">
          <h3 className="text-lg font-semibold text-white mb-4">{t('blender_instructions')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">{t('blender_step1')}</p>
              <p className="text-gray-400">{t('blender_step1_desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">{t('blender_step2')}</p>
              <p className="text-gray-400">{t('blender_step2_desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Box className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">{t('blender_step3')}</p>
              <p className="text-gray-400">{t('blender_step3_desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">{t('blender_step4')}</p>
              <p className="text-gray-400">{t('blender_step4_desc')}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 