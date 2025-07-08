import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// Step 3: Interior generation with Hugging Face
// Use Stable Diffusion XL model from Hugging Face Inference API
// Include uploaded image as input for img2img generation

// Hugging Face Configuration
const HF_CONFIG = {
      apiKey: process.env.HF_TOKEN || process.env.HF_API_KEY || 'YOUR_HUGGING_FACE_TOKEN_HERE',
  // Using a model that supports img2img for interior design
  model: 'stabilityai/stable-diffusion-xl-base-1.0',
  endpoint: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'
}

interface GenerationRequest {
  prompt?: string
  imageUrl?: string        // URL of uploaded apartment image
  layoutUrl?: string       // Step 2 placeholder: 2D layout image URL
  style?: string
  roomType?: string
  budgetLevel?: string
}

interface GenerationResponse {
  success: boolean
  imageUrl?: string
  base64Image?: string
  metadata?: any
  error?: string
  details?: string
}

// Enhanced prompt for interior design generation
function createInteriorDesignPrompt(customPrompt?: string, style?: string): string {
  const basePrompt = `
modern, contemporary, minimalist apartment interior, clean lines, natural lighting, cozy and functional, smart furniture, cost-effective design, Scandinavian aesthetic, neutral tones, comfortable seating, entertainment area, plants, shelves, textures, subtle elegance, photorealistic, high-resolution
  `.trim()

  const styleModifiers = {
    modern: "modern, contemporary, clean lines, minimalist",
    scandinavian: "scandinavian, hygge, natural materials, light wood, cozy",
    industrial: "industrial, exposed brick, metal fixtures, urban loft", 
    luxury: "luxury, premium materials, elegant, sophisticated, high-end",
    minimalist: "minimalist, simple, uncluttered, zen, functional"
  }

  const styleText = style && styleModifiers[style as keyof typeof styleModifiers] 
    ? styleModifiers[style as keyof typeof styleModifiers] 
    : ""

  return customPrompt 
    ? `${customPrompt}, ${basePrompt}, ${styleText}`.replace(/,\s*,/g, ',').trim()
    : `${basePrompt}, ${styleText}`.replace(/,\s*,/g, ',').trim()
}

// Convert image file to base64
async function imageToBase64(imageUrl: string): Promise<string> {
  try {
    if (imageUrl.startsWith('/uploads/')) {
      // Local uploaded file
      const filePath = path.join(process.cwd(), 'public', imageUrl)
      const imageBuffer = fs.readFileSync(filePath)
      return imageBuffer.toString('base64')
    } else {
      // External URL
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      const base64String = Buffer.from(arrayBuffer).toString('base64')
      return base64String
    }
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error}`)
  }
}

// Generate interior design using Hugging Face Inference API
async function generateWithHuggingFace(prompt: string, inputImageBase64?: string): Promise<Blob> {
  console.log('🎨 Calling Hugging Face Inference API...')
  
  if (!HF_CONFIG.apiKey || HF_CONFIG.apiKey === 'your_hf_token') {
    throw new Error('HF_TOKEN not configured. Please set it in your .env file.')
  }

  const requestBody: any = {
    inputs: prompt,
    parameters: {
      num_inference_steps: 30,
      guidance_scale: 7.5,
      width: 1024,
      height: 1024
    }
  }

  // If we have an input image, use it for img2img
  if (inputImageBase64) {
    requestBody.inputs = {
      prompt: prompt,
      image: inputImageBase64
    }
    requestBody.parameters.strength = 0.8 // How much to change the input image
  }

  console.log('📝 HF Request:', { 
    prompt: prompt.substring(0, 100) + '...', 
    hasInputImage: !!inputImageBase64,
    model: HF_CONFIG.model 
  })

  const response = await fetch(HF_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Hugging Face API error:', errorText)
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
  }

  return await response.blob()
}

// Save base64 image to generated-images folder
async function saveGeneratedImage(base64Data: string, filename: string): Promise<string> {
  try {
    // Remove data URL prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '')
    
    // Create generated-images directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'generated-images')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    // Save file
    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, base64Image, 'base64')
    
    // Return public URL
    return `/generated-images/${filename}`
  } catch (error) {
    console.error('Error saving generated image:', error)
    throw new Error('Failed to save generated image')
  }
}

// Main API endpoint for interior generation
export async function POST(request: NextRequest) {
  try {
    console.log('🏠 Starting interior design generation...')
    
    const body = await request.json() as GenerationRequest
    const { 
      prompt, 
      imageUrl, 
      layoutUrl,  // Step 2 placeholder
      style = 'modern',
      roomType = 'living-room',
      budgetLevel = 'medium'
    } = body
    
    console.log('📝 Generation Request:', { 
      hasCustomPrompt: !!prompt,
      hasInputImage: !!imageUrl,
      hasLayout: !!layoutUrl,  // Step 2 placeholder
      style,
      roomType,
      budgetLevel
    })

    // Create enhanced prompt for interior design
    const enhancedPrompt = createInteriorDesignPrompt(prompt, style)
    console.log('🚀 Enhanced prompt:', enhancedPrompt.substring(0, 200) + '...')

    let inputImageBase64: string | undefined
    
    // Convert input image to base64 if provided
    if (imageUrl) {
      try {
        console.log('🖼️ Converting input image to base64...')
        inputImageBase64 = await imageToBase64(imageUrl)
        console.log('✅ Input image converted successfully')
      } catch (error) {
        console.error('❌ Failed to convert input image:', error)
        return NextResponse.json(
          { 
            success: false,
            error: 'Failed to process input image',
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 400 }
        )
      }
    }

    try {
      // Generate interior design with Hugging Face
      console.log('🎨 Generating interior design with Stable Diffusion XL...')
      
      const imageBlob = await generateWithHuggingFace(enhancedPrompt, inputImageBase64)
      
      // Convert blob to base64
      const arrayBuffer = await imageBlob.arrayBuffer()
      const base64String = Buffer.from(arrayBuffer).toString('base64')
      
      // Save generated image
      const timestamp = Date.now()
      const filename = `interior-${style}-${roomType}-${timestamp}.png`
      
      const savedImageUrl = await saveGeneratedImage(base64String, filename)
      
      const metadata = {
        model: "stable-diffusion-xl",
        provider: "huggingface",
        style: style,
        roomType: roomType,
        budgetLevel: budgetLevel,
        enhancedPrompt: enhancedPrompt,
        originalPrompt: prompt,
        inputImageUsed: !!imageUrl,
        layoutImageUsed: !!layoutUrl, // Step 2 placeholder
        timestamp: new Date().toISOString(),
        estimatedCost: '$0.002' // Much cheaper than OpenAI
      }
      
      console.log('✅ Interior design generation completed successfully!')
      
      const response: GenerationResponse = {
        success: true,
        imageUrl: savedImageUrl,
        base64Image: `data:image/png;base64,${base64String}`,
        metadata: metadata
      }

      return NextResponse.json(response)
      
    } catch (generateError) {
      console.error('❌ Generation failed:', generateError)
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to generate interior design', 
          details: generateError instanceof Error ? generateError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('💥 Error in interior generation:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Interior Design Generation API with Hugging Face',
    provider: 'huggingface',
    model: HF_CONFIG.model,
    version: '1.0.0',
    apiKeyConfigured: !!HF_CONFIG.apiKey && HF_CONFIG.apiKey !== 'your_hf_token',
    supportedStyles: ['modern', 'scandinavian', 'industrial', 'luxury', 'minimalist'],
    features: {
      textToImage: true,
      imageToImage: true,
      layoutSupport: false // Step 2 placeholder
    }
  })
} 