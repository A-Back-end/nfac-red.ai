'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, X, Loader2, Brain, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { useAppStore } from '../../../../lib/store'
import { OpenAIService, fileToBase64 } from '../../../../lib/api'
import { calculateTokenCost, cn } from '../../../../lib/utils'
import toast from 'react-hot-toast'

/**
 * Image Upload Component
 * Handles floor plan uploads, analysis, and project creation
 */
export function ImageUpload() {
  const { 
    openaiApiKey, 
    addMessage, 
    addProject, 
    setCurrentImage,
    addTokenUsage 
  } = useAppStore()
  
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [customPrompt, setCustomPrompt] = useState('')

  // Initialize OpenAI service
  const openaiService = new OpenAIService(openaiApiKey)

  /**
   * Handle file drop/upload
   */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    try {
      // Convert to base64 for preview and API calls
      const base64 = await fileToBase64(file)
      const dataUrl = `data:${file.type};base64,${base64}`
      
      setUploadedImage(dataUrl)
      setCurrentImage(dataUrl)
      
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }, [setCurrentImage])

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  /**
   * Analyze uploaded floor plan with AI
   */
  const analyzeFloorPlan = async () => {
    if (!uploadedImage || !openaiApiKey) {
      toast.error('Please upload an image and set your OpenAI API key')
      return
    }

    setAnalyzing(true)
    try {
      // Extract base64 from data URL
      const base64 = uploadedImage.split(',')[1]
      
      // Call OpenAI API for analysis
      const result = await openaiService.analyzeFloorPlan(base64, customPrompt)
      
      setAnalysisResult(result)
      
      // Track token usage
      const cost = calculateTokenCost(result.tokens.input, result.tokens.output)
      addTokenUsage(result.tokens.input, result.tokens.output, cost)
      
      // Add to chat history
      addMessage({
        role: 'assistant',
        content: result.content,
        tokens: {
          input: result.tokens.input,
          output: result.tokens.output,
          cost
        },
        image: uploadedImage
      })
      
      toast.success('Floor plan analyzed successfully!')
      
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze floor plan. Please check your API key.')
    } finally {
      setAnalyzing(false)
    }
  }

  /**
   * Save current analysis as a project
   */
  const saveAsProject = () => {
    if (!uploadedImage || !analysisResult) {
      toast.error('Please upload and analyze an image first')
      return
    }

    const projectName = `Floor Plan Analysis ${new Date().toLocaleDateString()}`
    
    addProject({
      name: projectName,
      description: 'AI-analyzed floor plan with design suggestions',
      image: uploadedImage,
      userId: 'demo_user',
      status: 'analysis',
      generatedImages: [],
      budget: { min: 50000, max: 200000 },
      preferredStyles: ['modern'],
      restrictions: []
    })
    
    toast.success('Project saved successfully!')
  }

  /**
   * Clear current upload and analysis
   */
  const clearUpload = () => {
    setUploadedImage(null)
    setAnalysisResult(null)
    setCurrentImage(null)
    setCustomPrompt('')
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Floor Plan</span>
          </CardTitle>
          <CardDescription>
            Upload an apartment layout or blueprint image for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedImage ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive 
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950" 
                  : "border-gray-300 hover:border-primary-400 dark:border-gray-600"
              )}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                {uploading ? (
                  <Loader2 className="mx-auto h-12 w-12 text-primary-500 animate-spin" />
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {uploading ? 'Uploading...' : 'Drop your floor plan here'}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to browse files
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Supports JPEG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded floor plan"
                  className="w-full max-h-96 object-contain rounded-lg border"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearUpload}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Custom Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Custom Analysis Prompt (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Focus on kitchen layout and suggest improvements for better workflow..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  rows={3}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={analyzeFloorPlan}
                  disabled={!openaiApiKey || analyzing}
                  className="flex-1"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
                
                {analysisResult && (
                  <Button
                    variant="outline"
                    onClick={saveAsProject}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Save Project
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>
              Detailed analysis of your floor plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm">
                {analysisResult.content}
              </pre>
            </div>
            
            {/* Token Usage Info */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Token Usage:</strong> {analysisResult.tokens.input + analysisResult.tokens.output} tokens 
                (${calculateTokenCost(analysisResult.tokens.input, analysisResult.tokens.output).toFixed(4)})
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Use high-quality images with clear room boundaries</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Include room labels if available for better analysis</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Ensure good lighting and minimal shadows in photos</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Blueprint or architectural drawings work best</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 