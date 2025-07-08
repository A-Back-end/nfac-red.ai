'use client'

import React, { useState, useRef } from 'react'
import { Upload, Camera, Crown, Wand2, BarChart3, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface FluxDesignerProps {
  onAnalyze?: (data: any) => void
  onGenerate?: (data: any) => void
  onDesign?: (data: any) => void
}

export default function FluxDesigner({ onAnalyze, onGenerate, onDesign }: FluxDesignerProps) {
  const [selectedRoom, setSelectedRoom] = useState('living-room')
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [selectedBudget, setSelectedBudget] = useState('medium')
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [whatToAdd, setWhatToAdd] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [generate3D, setGenerate3D] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rooms = [
    { id: 'living-room', name: 'Гостиная', icon: '🛋️' },
    { id: 'kitchen', name: 'Кухня', icon: '🍳' },
    { id: 'office', name: 'Кабинет', icon: '🖥️' },
    { id: 'bedroom', name: 'Спальня', icon: '🛏️' },
    { id: 'bathroom', name: 'Ванная', icon: '🛁' },
    { id: 'dining', name: 'Столовая', icon: '🍽️' }
  ]

  const styles = [
    { id: 'modern', name: 'Современный', icon: '🏢' },
    { id: 'minimalist', name: 'Минимализм', icon: '⚪' },
    { id: 'scandinavian', name: 'Скандинавский', icon: '🌲' },
    { id: 'loft', name: 'Лофт', icon: '🏭' },
    { id: 'boho', name: 'Бохо', icon: '🌸' },
    { id: 'classic', name: 'Классика', icon: '👑' }
  ]

  const budgets = [
    { id: 'low', name: 'Бюджет', range: '$500-2k', icon: '💚' },
    { id: 'medium', name: 'Средний', range: '$2k-8k', icon: '🧡' },
    { id: 'high', name: 'Премиум', range: '$8k+', icon: '💎' }
  ]

  const handleImageUpload = (file: File) => {
    setReferenceImage(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleAnalyze = () => {
    const data = {
      room: selectedRoom,
      style: selectedStyle,
      budget: selectedBudget,
      referenceImage,
      whatToAdd,
      generate3D
    }
    onAnalyze?.(data)
  }

  const handleGenerate = () => {
    const data = {
      room: selectedRoom,
      style: selectedStyle,
      budget: selectedBudget,
      referenceImage,
      whatToAdd,
      generate3D
    }
    onGenerate?.(data)
  }

  const handleComplexDesign = () => {
    const data = {
      room: selectedRoom,
      style: selectedStyle,
      budget: selectedBudget,
      referenceImage,
      whatToAdd,
      generate3D
    }
    onDesign?.(data)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              RED AI FLUX Designer
            </span>
            <Crown className="h-8 w-8 text-yellow-500" />
          </h1>
        </div>
        <p className="text-lg text-slate-300">
          Создавайте профессиональные интерьеры с помощью FLUX.1-Kontext и{' '}
          <span className="text-blue-400 font-semibold">архитектурного анализа GPT-4o Vision</span>
        </p>
      </div>

      {/* Photography Settings */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Camera className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Настройки фотографии</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Room Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Комната</h3>
              <div className="grid grid-cols-2 gap-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 ${
                      selectedRoom === room.id
                        ? 'bg-blue-500 border-blue-400 text-white'
                        : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-lg">{room.icon}</span>
                    <span className="text-sm font-medium">{room.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Стиль</h3>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 ${
                      selectedStyle === style.id
                        ? 'bg-blue-500 border-blue-400 text-white'
                        : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-lg">{style.icon}</span>
                    <span className="text-sm font-medium">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Бюджет</h3>
              <div className="space-y-2">
                {budgets.map((budget) => (
                  <button
                    key={budget.id}
                    onClick={() => setSelectedBudget(budget.id)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                      selectedBudget === budget.id
                        ? 'bg-blue-500 border-blue-400 text-white'
                        : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{budget.icon}</span>
                      <span className="text-sm font-medium">{budget.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{budget.range}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reference Photo and Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reference Photo */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Референсное фото (опционально)
            </h3>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragging
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              
              {referenceImage ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-green-400 font-medium">{referenceImage.name}</p>
                  <p className="text-sm text-slate-400">Нажмите для замены</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="text-white font-medium">Загрузить фото комнаты</p>
                  <p className="text-sm text-slate-400">
                    Перетащите изображение или нажмите для выбора<br />
                    JPG, PNG, WEBP до 10MB
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* What to Add */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Что добавить в интерьер
            </h3>
            <Textarea
              placeholder="add_to_interior"
              value={whatToAdd}
              onChange={(e) => setWhatToAdd(e.target.value)}
              className="min-h-[120px] bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 resize-none"
            />
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="generate3d"
                checked={generate3D}
                onChange={(e) => setGenerate3D(e.target.checked)}
                className="rounded border-slate-600"
              />
              <label htmlFor="generate3d" className="text-sm text-slate-300">
                describe_desired_changes
              </label>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              0/1000
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Model Generation */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="generate_3d_model"
          checked={generate3D}
          onChange={(e) => setGenerate3D(e.target.checked)}
          className="rounded border-slate-600"
        />
        <label htmlFor="generate_3d_model" className="text-white">
          generate_3d_model
        </label>
        <select className="ml-4 bg-slate-700 border-slate-600 text-white rounded px-2 py-1">
          <option value="quality_hd">quality_hd</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleAnalyze}
          className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <BarChart3 className="h-5 w-5" />
          <span>ai_analysis</span>
        </Button>
        
        <Button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Wand2 className="h-5 w-5" />
          <span>Stable Diffusion XL Генерация</span>
        </Button>
        
        <Button
          onClick={handleComplexDesign}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Brain className="h-5 w-5" />
          <span>Комплексный дизайн</span>
        </Button>
      </div>
    </div>
  )
} 