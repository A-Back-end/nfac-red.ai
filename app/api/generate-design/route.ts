import { NextRequest, NextResponse } from 'next/server'
import { DesignRecommendation, RoomAnalysis } from '@/lib/types'
import fs from 'fs'
import path from 'path'
import base64 from 'base64-js'

// Hugging Face Configuration for Stable Diffusion XL
const HF_CONFIG = {
      apiKey: process.env.HF_API_KEY || 'YOUR_HUGGING_FACE_API_KEY_HERE',
  model: 'stabilityai/stable-diffusion-xl-base-1.0',
  endpoint: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'
}

// Mock IKEA product database (в продакшене это была бы настоящая база данных)
const IKEA_PRODUCTS = {
  sofa: [
    { name: "KIVIK", price: 15000, imageUrl: "https://www.ikea.com/images/kivik-sofa.jpg", url: "https://www.ikea.com/kivik" },
    { name: "EKTORP", price: 12000, imageUrl: "https://www.ikea.com/images/ektorp-sofa.jpg", url: "https://www.ikea.com/ektorp" },
    { name: "SÖDERHAMN", price: 18000, imageUrl: "https://www.ikea.com/images/soderhamn-sofa.jpg", url: "https://www.ikea.com/soderhamn" }
  ],
  table: [
    { name: "LACK", price: 2000, imageUrl: "https://www.ikea.com/images/lack-table.jpg", url: "https://www.ikea.com/lack" },
    { name: "HEMNES", price: 5500, imageUrl: "https://www.ikea.com/images/hemnes-table.jpg", url: "https://www.ikea.com/hemnes" }
  ],
  chair: [
    { name: "TOBIAS", price: 4000, imageUrl: "https://www.ikea.com/images/tobias-chair.jpg", url: "https://www.ikea.com/tobias" },
    { name: "MARKUS", price: 8000, imageUrl: "https://www.ikea.com/images/markus-chair.jpg", url: "https://www.ikea.com/markus" }
  ],
  storage: [
    { name: "KALLAX", price: 3500, imageUrl: "https://www.ikea.com/images/kallax-shelf.jpg", url: "https://www.ikea.com/kallax" },
    { name: "HEMNES", price: 7000, imageUrl: "https://www.ikea.com/images/hemnes-shelf.jpg", url: "https://www.ikea.com/hemnes" }
  ]
}

// Бесплатная версия - генерируем реалистичные дизайн-рекомендации
function generateFreeDesignRecommendation(roomAnalysis: RoomAnalysis, preferences: any): any {
  const styles = ['modern', 'minimalist', 'scandinavian', 'industrial', 'classic']
  const currentStyle = styles[Math.floor(Math.random() * styles.length)]
  
  // Цветовые палитры для разных стилей
  const colorPalettes = {
    modern: { primary: '#FFFFFF', secondary: '#2C3E50', accent: '#3498DB', neutral: '#ECF0F1' },
    minimalist: { primary: '#FFFFFF', secondary: '#F8F9FA', accent: '#6C757D', neutral: '#E9ECEF' },
    scandinavian: { primary: '#FFFFFF', secondary: '#F5F5DC', accent: '#4A90A4', neutral: '#D3D3D3' },
    industrial: { primary: '#2C2C2C', secondary: '#8B4513', accent: '#FF6347', neutral: '#A9A9A9' },
    classic: { primary: '#F5F5F5', secondary: '#8B4513', accent: '#DAA520', neutral: '#D2B48C' }
  }

  // Базовая мебель в зависимости от типа комнаты
  const furnitureByRoom = {
    living_room: [
      { name: 'Современный диван', category: 'sofa', description: 'Удобный диван для зоны отдыха', price: 45000, priority: 'essential' },
      { name: 'Журнальный столик', category: 'table', description: 'Стильный столик для гостиной', price: 12000, priority: 'recommended' },
      { name: 'Книжная полка', category: 'storage', description: 'Функциональная система хранения', price: 15000, priority: 'optional' }
    ],
    bedroom: [
      { name: 'Кровать', category: 'bed', description: 'Комфортная кровать для спальни', price: 35000, priority: 'essential' },
      { name: 'Прикроватная тумба', category: 'storage', description: 'Удобная тумба у кровати', price: 8000, priority: 'recommended' },
      { name: 'Рабочее кресло', category: 'chair', description: 'Эргономичное кресло', price: 12000, priority: 'optional' }
    ],
    kitchen: [
      { name: 'Обеденный стол', category: 'table', description: 'Практичный стол для кухни', price: 20000, priority: 'essential' },
      { name: 'Стулья', category: 'chair', description: 'Комфортные стулья', price: 6000, priority: 'essential' },
      { name: 'Кухонный шкаф', category: 'storage', description: 'Система хранения', price: 25000, priority: 'recommended' }
    ],
    office: [
      { name: 'Рабочий стол', category: 'desk', description: 'Эргономичный рабочий стол', price: 18000, priority: 'essential' },
      { name: 'Офисное кресло', category: 'chair', description: 'Комфортное рабочее кресло', price: 15000, priority: 'essential' },
      { name: 'Стеллаж', category: 'storage', description: 'Организация рабочего пространства', price: 12000, priority: 'recommended' }
    ]
  }

  const roomFurniture = furnitureByRoom[roomAnalysis.roomType as keyof typeof furnitureByRoom] || furnitureByRoom.living_room

  // Освещение
  const lighting = [
    { type: 'ceiling', name: 'Потолочная лампа', description: 'Основное освещение комнаты', price: 8000 },
    { type: 'floor', name: 'Торшер', description: 'Дополнительное освещение', price: 6000 }
  ]

  // Декор
  const decorations = [
    { type: 'art', name: 'Настенные картины', description: 'Стильные картины для декора стен', price: 5000 },
    { type: 'plants', name: 'Комнатные растения', description: 'Живые растения для уюта', price: 3000 },
    { type: 'textiles', name: 'Декоративные подушки', description: 'Мягкий текстиль для комфорта', price: 2500 }
  ]

  // Рассчитываем стоимость
  const furnitureCost = roomFurniture.reduce((sum, item) => sum + item.price, 0)
  const lightingCost = lighting.reduce((sum, item) => sum + item.price, 0)
  const decorCost = decorations.reduce((sum, item) => sum + item.price, 0)
  const totalMin = Math.round((furnitureCost + lightingCost + decorCost) * 0.9)
  const totalMax = Math.round((furnitureCost + lightingCost + decorCost) * 1.2)

  return {
    style: currentStyle,
    colorPalette: colorPalettes[currentStyle as keyof typeof colorPalettes],
    furniture: roomFurniture.map(item => ({
      ...item,
      dimensions: { width: 2 + Math.random(), height: 0.5 + Math.random(), depth: 1 + Math.random() },
      position: { x: Math.random() * 3, y: 0, z: Math.random() * 3 }
    })),
    lighting: lighting.map(item => ({
      ...item,
      position: { x: Math.random() * 4, y: item.type === 'ceiling' ? 3 : 0, z: Math.random() * 4 }
    })),
    decorations,
    estimatedCost: {
      min: totalMin,
      max: totalMax,
      currency: 'RUB'
    }
  }
}

interface DesignGenerationRequest {
  prompt: string
  referenceImages?: string[] // base64 encoded images for editing
  style?: string
  roomType?: string
  budgetLevel?: string
  quality?: 'standard' | 'hd'
  mode?: 'generate' | 'edit'
}

// Enhanced prompt creation for interior design
function createPremiumInteriorPrompt(
  prompt: string, 
  style: string, 
  roomType: string, 
  budgetLevel: string
): string {
  const styleDescriptions: Record<string, string> = {
    modern: "sleek contemporary design, clean lines, premium materials, minimalist aesthetic",
    minimalist: "clean simple design, neutral colors, functional furniture, uncluttered space",
    scandinavian: "light woods, white walls, cozy textiles, hygge atmosphere, natural light",
    industrial: "exposed brick, steel elements, vintage furniture, urban loft style",
    bohemian: "eclectic mix, rich colors, layered textiles, artistic elements, global influences",
    classic: "timeless elegance, traditional furniture, sophisticated color palette"
  }

  const roomDescriptions: Record<string, string> = {
    living: "comfortable seating area, entertainment space, social gathering zone",
    bedroom: "restful sleeping space, personal sanctuary, calming atmosphere", 
    kitchen: "functional cooking space, dining area, family gathering hub",
    bathroom: "spa-like retreat, modern fixtures, relaxing ambiance",
    office: "productive workspace, organized storage, professional environment",
    dining: "elegant dining space, entertaining area, sophisticated atmosphere"
  }

  const budgetDescriptions: Record<string, string> = {
    low: "affordable furnishings, smart design choices, maximum impact on budget",
    medium: "quality mid-range furniture, balanced investment, good value pieces",
    high: "luxury materials, designer furniture, premium finishes, high-end appliances"
  }

  return `Transform this interior space: ${prompt}

Style: ${styleDescriptions[style] || styleDescriptions.modern}
Room type: ${roomDescriptions[roomType] || roomDescriptions.living}
Budget approach: ${budgetDescriptions[budgetLevel] || budgetDescriptions.medium}

Create a photorealistic interior design with sophisticated furniture, layered lighting, plants, quality materials, and perfect proportions. Professional architectural photography, natural lighting, 8K resolution, magazine quality composition.`
}

// Save base64 image to file system
async function saveImageToFile(base64String: string, filename: string): Promise<string> {
  try {
    const publicDir = path.join(process.cwd(), 'public', 'generated-images')
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    const imageBuffer = Buffer.from(base64String, 'base64')
    const filePath = path.join(publicDir, filename)
    
    await fs.promises.writeFile(filePath, imageBuffer)
    
    return `/generated-images/${filename}`
  } catch (error) {
    console.error('Error saving image:', error)
    throw new Error('Failed to save image')
  }
}

// Generate furniture recommendations based on generated design
function generatePremiumFurniture(style: string, roomType: string, budgetLevel: string, prompt: string) {
  const furnitureDatabase: Record<string, Record<string, any[]>> = {
    modern: {
      living: [
        { name: "Модульный диван", price: "от 85,000₽", description: "Трансформируемая мебель для гостиной", category: "seating" },
        { name: "Журнальный стол", price: "от 25,000₽", description: "Стеклянная столешница с металлическими ножками", category: "tables" },
        { name: "ТВ-тумба", price: "от 40,000₽", description: "Подвесная тумба с LED-подсветкой", category: "storage" }
      ],
      bedroom: [
        { name: "Кровать-платформа", price: "от 60,000₽", description: "Современная кровать с минималистичным дизайном", category: "beds" },
        { name: "Прикроватные тумбы", price: "от 15,000₽", description: "Парящие тумбы с LED-подсветкой", category: "storage" },
        { name: "Гардеробная система", price: "от 120,000₽", description: "Встроенная система хранения", category: "wardrobes" }
      ],
      kitchen: [
        { name: "Кухонный гарнитур", price: "от 150,000₽", description: "Современная кухня с островом", category: "kitchen" },
        { name: "Барные стулья", price: "от 20,000₽", description: "Дизайнерские стулья для острова", category: "seating" },
        { name: "Обеденный стол", price: "от 35,000₽", description: "Стол из натурального дерева", category: "tables" }
      ]
    },
    minimalist: {
      living: [
        { name: "Лаконичный диван", price: "от 60,000₽", description: "Простые формы, нейтральные цвета", category: "seating" },
        { name: "Минималистичный стол", price: "от 20,000₽", description: "Чистые линии, функциональность", category: "tables" },
        { name: "Система хранения", price: "от 30,000₽", description: "Скрытые полки и шкафы", category: "storage" }
      ],
      bedroom: [
        { name: "Простая кровать", price: "от 40,000₽", description: "Минимализм в чистом виде", category: "beds" },
        { name: "Встроенные шкафы", price: "от 80,000₽", description: "Невидимые системы хранения", category: "wardrobes" }
      ],
      kitchen: [
        { name: "Простая кухня", price: "от 100,000₽", description: "Функциональность превыше всего", category: "kitchen" },
        { name: "Скрытая техника", price: "от 50,000₽", description: "Встроенная бытовая техника", category: "appliances" }
      ]
    },
    scandinavian: {
      living: [
        { name: "Деревянный диван", price: "от 70,000₽", description: "Светлое дерево, уютные подушки", category: "seating" },
        { name: "Кофейный столик", price: "от 18,000₽", description: "Натуральное дерево, простые формы", category: "tables" },
        { name: "Текстильные аксессуары", price: "от 10,000₽", description: "Пледы, подушки, ковры", category: "textiles" }
      ],
      bedroom: [
        { name: "Деревянная кровать", price: "от 50,000₽", description: "Светлая древесина, уютный стиль", category: "beds" },
        { name: "Комод", price: "от 25,000₽", description: "Функциональное хранение", category: "storage" }
      ],
      kitchen: [
        { name: "Деревянная кухня", price: "от 120,000₽", description: "Светлые оттенки, натуральные материалы", category: "kitchen" },
        { name: "Обеденная группа", price: "от 40,000₽", description: "Стол и стулья из дерева", category: "dining" }
      ]
    }
  }

  const roomFurniture = furnitureDatabase[style]?.[roomType] || furnitureDatabase.modern.living
  return roomFurniture
}

// Generate Pinterest-style design ideas
function generateIntelligentPinterestStyles(style: string, prompt: string) {
  const styles = [
    { name: "Современный минимализм", description: "Чистые линии и нейтральные цвета", image: "/img/style-modern-minimalism.jpg" },
    { name: "Скандинавский уют", description: "Светлые оттенки и натуральные материалы", image: "/img/style-scandinavian.jpg" },
    { name: "Индустриальный лофт", description: "Кирпич, металл и винтажные элементы", image: "/img/style-industrial.jpg" },
    { name: "Классическая элегантность", description: "Изысканные формы и благородные материалы", image: "/img/style-classic.jpg" }
  ]
  
  return styles.slice(0, 3) // Return 3 related styles
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Starting image generation with Stable Diffusion XL...')
    
    const hfApiKey = process.env.HF_API_KEY || HF_CONFIG.apiKey
    if (!hfApiKey) {
      console.error('❌ No Hugging Face API key found')
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      )
    }
    
    const body = await request.json() as DesignGenerationRequest
    const { 
      prompt, 
      referenceImages = [],
      style = 'modern', 
      roomType = 'living',
      budgetLevel = 'medium',
      quality = 'hd',
      mode = 'generate'
    } = body
    
    console.log('📝 Request:', { 
      prompt: prompt?.substring(0, 100) + '...', 
      hasReferenceImages: referenceImages.length > 0,
      style,
      roomType,
      budgetLevel,
      quality,
      mode
    })
    
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Design description is required' },
        { status: 400 }
      )
    }

    let generatedImageUrl = ''
    let generatedImageBase64 = ''
    let imageMetadata: any = {}

    // Enhanced prompt for interior design
    const enhancedPrompt = createPremiumInteriorPrompt(prompt, style, roomType, budgetLevel)
    console.log('🚀 Enhanced prompt:', enhancedPrompt.substring(0, 200) + '...')

    try {
      // Generate image with Stable Diffusion XL
      console.log('🎨 Generating image with Stable Diffusion XL...')
      
      const hfResponse = await fetch(HF_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted, deformed",
            num_inference_steps: 50,
            guidance_scale: 7.5,
            height: 1024,
            width: 1024
          }
        })
      })

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text()
        throw new Error(`Hugging Face API error: ${hfResponse.status} - ${errorText}`)
      }

      const imageArrayBuffer = await hfResponse.arrayBuffer()
      const imageBase64 = Buffer.from(imageArrayBuffer).toString('base64')
      
      const response = {
        data: [{
          b64_json: imageBase64,
          revised_prompt: enhancedPrompt
        }]
      }

      if (response.data && response.data[0] && response.data[0].b64_json) {
        generatedImageBase64 = response.data[0].b64_json
        
        // Save to file system
        const timestamp = Date.now()
        const filename = `sdxl-${style}-${roomType}-${timestamp}.png`
        
        const savedImageUrl = await saveImageToFile(generatedImageBase64, filename)
        generatedImageUrl = savedImageUrl
        
        imageMetadata = {
          model: "stable-diffusion-xl",
          mode: "generate",
          revisedPrompt: response.data[0].revised_prompt || enhancedPrompt,
          size: "1024x1024",
          quality: quality,
          style: "photorealistic"
        }
        
        console.log('✅ Image generation completed successfully!')
        console.log('📄 Revised prompt:', response.data[0].revised_prompt?.substring(0, 100) + '...')
      } else {
        throw new Error('No image data received from Stable Diffusion XL')
      }
    } catch (generateError) {
      console.error('❌ Stable Diffusion XL generation failed:', generateError)
      
      // Return error response
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to generate image with Stable Diffusion XL', 
          details: generateError instanceof Error ? generateError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

    // Generate additional content
    const furniture = generatePremiumFurniture(style, roomType, budgetLevel, prompt)
    const pinterestStyles = generateIntelligentPinterestStyles(style, prompt)

    // Calculate estimated cost
    const estimatedCost = quality === 'hd' ? '$0.004' : '$0.002'

    const response = {
      success: true,
      imageUrl: generatedImageUrl,
      base64Image: generatedImageBase64 ? `data:image/png;base64,${generatedImageBase64}` : null,
      furniture,
      pinterestStyles,
      threeDModel: null, // Future feature
      metadata: {
        style,
        roomType,
        budgetLevel,
        quality,
        enhancedPrompt: enhancedPrompt.substring(0, 200) + '...',
        imageAnalysis: 'Professional interior design generated with Stable Diffusion XL',
        timestamp: new Date().toISOString(),
        hasReferenceImage: referenceImages.length > 0,
        originalPrompt: prompt,
        estimatedCost: estimatedCost,
        generationMode: 'stable-diffusion-xl-generate',
        model: 'stable-diffusion-xl',
        ...imageMetadata
      }
    }

    console.log('🎉 Design generation completed successfully!')
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Error in design generation:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate design', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 