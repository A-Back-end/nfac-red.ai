import { NextRequest, NextResponse } from 'next/server'
import { Project } from '@/lib/types'

// Временное глобальное хранилище для демо
declare global {
  var __PROJECTS_DB: Project[] | undefined
}

// Получение данных проектов из внутреннего API
async function getProjectFromAPI(projectId: string): Promise<Project | null> {
  try {
    // В Next.js мы не можем делать fetch к самому себе, поэтому импортируем логику напрямую
    // В продакшене это был бы запрос к базе данных
    
    // Временно используем глобальное хранилище для хранения данных
    const projectsData = globalThis.__PROJECTS_DB || []
    return projectsData.find((p: Project) => p.id === projectId) || null
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting PDF export...')
    
    const { projectId, includeShoppingList = true, includeAnalysis = true, include3D = false } = await request.json()
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Получаем проект из глобального хранилища
    let project = await getProjectFromAPI(projectId)
    
    // Если проект не найден, используем демо-данные для тестирования
    if (!project) {
      console.log('Project not found, using demo data for:', projectId)
      project = createDemoProject(projectId)
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    console.log('Generating PDF for project:', {
      id: project.id,
      name: project.name,
      hasRoomAnalysis: !!project.roomAnalysis,
      hasDesignRecommendation: !!project.designRecommendation
    })

    // Генерируем HTML для PDF
    const htmlContent = generateProjectHTML(project, includeShoppingList, includeAnalysis, include3D)
    
    console.log('PDF export completed successfully for project:', projectId)

    return NextResponse.json({
      success: true,
      htmlPreview: htmlContent,
      project: project,
      downloadUrl: `/api/download-pdf?projectId=${projectId}`
    })

  } catch (error: any) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { 
        error: 'PDF export failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

function createDemoProject(projectId: string): Project {
  return {
    id: projectId,
    userId: 'demo_user',
    name: 'Дизайн современной гостиной',
    description: 'Минималистичный дизайн с элементами скандинавского стиля',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T15:30:00Z',
    status: 'completed',
    budget: { min: 80000, max: 150000 },
    preferredStyles: ['modern', 'scandinavian'],
    restrictions: [],
    generatedImages: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600'
    ],
    roomAnalysis: {
      id: 'analysis_1',
      timestamp: '2024-01-15T10:00:00Z',
      originalImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600',
      roomType: 'living_room',
      dimensions: { width: 4.5, height: 3.2, area: 14.4 },
      currentStyle: 'Устаревший интерьер',
      lighting: 'natural',
      colors: ['белый', 'бежевый', 'светло-серый'],
      furniture: [
        {
          type: 'старый диван',
          position: { x: 0.2, y: 0.5 },
          size: { width: 2.0, height: 0.8 },
          condition: 'poor',
          suggestions: ['заменить на современный диван']
        },
        {
          type: 'журнальный столик',
          position: { x: 0.6, y: 0.7 },
          size: { width: 1.0, height: 0.4 },
          condition: 'fair',
          suggestions: ['обновить поверхность']
        }
      ],
      problems: [
        'устаревшая мебель требует замены',
        'недостаточное декоративное освещение',
        'отсутствие акцентных элементов',
        'монотонная цветовая гамма'
      ],
      opportunities: [
        'добавить современную мебель',
        'создать функциональные зоны',
        'улучшить освещение с помощью ламп',
        'добавить растения и декор',
        'использовать яркие акцентные цвета'
      ]
    },
    designRecommendation: {
      id: 'design_1',
      projectId: projectId,
      style: 'modern',
      colorPalette: {
        primary: '#2c3e50',
        secondary: '#ecf0f1',
        accent: '#3498db',
        neutral: '#bdc3c7'
      },
      furniture: [
        {
          id: 'f1',
          name: 'KIVIK 3-местный диван',
          category: 'sofa',
          description: 'Современный диван с мягкой обивкой и удобными подушками',
          price: 45000,
          source: 'ikea',
          productUrl: 'https://www.ikea.com/kivik',
          imageUrl: 'https://via.placeholder.com/300x200',
          dimensions: { width: 2.28, height: 0.83, depth: 0.95 },
          position: { x: 1, y: 0, z: 1 },
          priority: 'essential'
        },
        {
          id: 'f2',
          name: 'LACK журнальный столик',
          category: 'table',
          description: 'Простой и функциональный столик',
          price: 8500,
          source: 'ikea',
          productUrl: 'https://www.ikea.com/lack',
          imageUrl: 'https://via.placeholder.com/300x200',
          dimensions: { width: 0.9, height: 0.45, depth: 0.55 },
          position: { x: 1.5, y: 0, z: 2 },
          priority: 'recommended'
        }
      ],
      lighting: [
        {
          type: 'floor',
          name: 'FOTO торшер',
          description: 'Современный торшер с регулировкой яркости',
          price: 8500,
          imageUrl: 'https://via.placeholder.com/200x200',
          position: { x: 0.5, y: 0, z: 0.5 }
        },
        {
          type: 'table',
          name: 'LAMPAN настольная лампа',
          description: 'Компактная лампа для дополнительного освещения',
          price: 3500,
          imageUrl: 'https://via.placeholder.com/200x200',
          position: { x: 2, y: 0.45, z: 2 }
        }
      ],
      decorations: [
        {
          type: 'plants',
          name: 'Монстера делициоза',
          description: 'Крупное комнатное растение для оживления интерьера',
          price: 2500,
          imageUrl: 'https://via.placeholder.com/200x200',
          inspiration: 'pinterest'
        },
        {
          type: 'textiles',
          name: 'Декоративные подушки',
          description: 'Набор подушек в акцентных цветах',
          price: 4500,
          imageUrl: 'https://via.placeholder.com/200x200',
          inspiration: 'custom'
        }
      ],
      estimatedCost: {
        min: 85000,
        max: 120000,
        currency: 'RUB'
      }
    },
    shoppingList: [
      {
        id: 's1',
        name: 'KIVIK 3-местный диван',
        category: 'Мебель',
        price: 45000,
        quantity: 1,
        source: 'IKEA',
        productUrl: 'https://www.ikea.com/kivik',
        imageUrl: 'https://via.placeholder.com/100x100',
        priority: 'essential',
        room: 'Гостиная'
      },
      {
        id: 's2',
        name: 'FOTO торшер',
        category: 'Освещение',
        price: 8500,
        quantity: 1,
        source: 'IKEA',
        productUrl: 'https://www.ikea.com/foto',
        imageUrl: 'https://via.placeholder.com/100x100',
        priority: 'recommended',
        room: 'Гостиная'
      },
      {
        id: 's3',
        name: 'Монстера делициоза',
        category: 'Декор',
        price: 2500,
        quantity: 1,
        source: 'Леруа Мерлен',
        productUrl: '#',
        imageUrl: 'https://via.placeholder.com/100x100',
        priority: 'optional',
        room: 'Гостиная'
      }
    ]
  }
}

function generateProjectHTML(project: Project, includeShoppingList: boolean, includeAnalysis: boolean, include3D: boolean): string {
  const totalCost = project.shoppingList?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  
  const getRoomTypeDisplay = (type: string) => {
    const types = {
      living_room: 'Гостиная',
      bedroom: 'Спальня',
      kitchen: 'Кухня',
      bathroom: 'Ванная',
      office: 'Кабинет',
      dining_room: 'Столовая',
      hallway: 'Прихожая'
    }
    return types[type as keyof typeof types] || type
  }

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - Дизайн-проект</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 0; 
      padding: 20px; 
      background: #f8f9fa; 
      line-height: 1.6;
      color: #333;
    }
    .container { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      padding: 30px; 
      border-radius: 10px; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header { 
      text-align: center; 
      margin-bottom: 40px; 
      border-bottom: 2px solid #3498db; 
      padding-bottom: 20px;
    }
    .header h1 { 
      color: #2c3e50; 
      margin: 0; 
      font-size: 2.5em; 
      font-weight: 300;
    }
    .header .subtitle { 
      color: #7f8c8d; 
      margin: 10px 0 0 0; 
      font-size: 1.1em;
    }
    .section { 
      margin: 30px 0; 
      padding: 20px; 
      border: 1px solid #ecf0f1; 
      border-radius: 8px;
      background: #fdfdfd;
    }
    .section h2 { 
      color: #2c3e50; 
      border-bottom: 2px solid #3498db; 
      padding-bottom: 10px; 
      margin-top: 0;
      font-size: 1.8em;
      font-weight: 400;
    }
    .section h3 { 
      color: #34495e; 
      margin: 20px 0 10px 0;
      font-size: 1.3em;
    }
    .grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 20px; 
      margin: 20px 0;
    }
    .info-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 0; 
      border-bottom: 1px solid #ecf0f1;
    }
    .info-item:last-child { 
      border-bottom: none; 
    }
    .info-label { 
      font-weight: 600; 
      color: #7f8c8d;
    }
    .info-value { 
      color: #2c3e50; 
      font-weight: 500;
    }
    .room-image { 
      width: 100%; 
      max-width: 400px; 
      height: 300px; 
      object-fit: cover; 
      border-radius: 8px; 
      margin: 20px auto; 
      display: block;
      border: 2px solid #ecf0f1;
    }
    .color-palette { 
      display: flex; 
      gap: 15px; 
      margin: 20px 0; 
      flex-wrap: wrap;
    }
    .color-item { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      padding: 8px 12px; 
      background: #f8f9fa; 
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }
    .color-box { 
      width: 20px; 
      height: 20px; 
      border-radius: 4px; 
      border: 1px solid #ccc;
    }
    .problems-opportunities { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 20px; 
      margin: 20px 0;
    }
    .problem-list, .opportunity-list { 
      padding: 15px; 
      border-radius: 6px;
    }
    .problem-list { 
      background: #ffeaa7; 
      border-left: 4px solid #fdcb6e;
    }
    .opportunity-list { 
      background: #a8e6cf; 
      border-left: 4px solid #00b894;
    }
    .problem-list h4, .opportunity-list h4 { 
      margin: 0 0 10px 0; 
      font-size: 1.1em;
    }
    .problem-list ul, .opportunity-list ul { 
      margin: 0; 
      padding-left: 20px;
    }
    .problem-list li, .opportunity-list li { 
      margin: 5px 0;
    }
    .shopping-item { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 15px; 
      margin: 10px 0; 
      background: #f8f9fa; 
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }
    .shopping-item .name { 
      font-weight: 600; 
      color: #2c3e50;
    }
    .shopping-item .category { 
      color: #7f8c8d; 
      font-size: 0.9em;
    }
    .shopping-item .price { 
      font-weight: 700; 
      color: #27ae60; 
      font-size: 1.1em;
    }
    .furniture-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 20px; 
      margin: 20px 0;
    }
    .furniture-item { 
      padding: 15px; 
      background: #f8f9fa; 
      border-radius: 8px; 
      border: 1px solid #dee2e6;
      text-align: center;
    }
    .furniture-item h4 { 
      margin: 0 0 10px 0; 
      color: #2c3e50;
    }
    .furniture-item .description { 
      color: #7f8c8d; 
      font-size: 0.9em; 
      margin: 5px 0;
    }
    .furniture-item .price { 
      font-weight: 700; 
      color: #27ae60; 
      font-size: 1.2em; 
      margin: 10px 0;
    }
    .priority-badge { 
      display: inline-block; 
      padding: 3px 8px; 
      border-radius: 12px; 
      font-size: 0.8em; 
      font-weight: 600; 
      text-transform: uppercase;
    }
    .priority-essential { 
      background: #ff7675; 
      color: white;
    }
    .priority-recommended { 
      background: #74b9ff; 
      color: white;
    }
    .priority-optional { 
      background: #a29bfe; 
      color: white;
    }
    .status-badge { 
      display: inline-block; 
      padding: 6px 12px; 
      border-radius: 20px; 
      font-size: 0.9em; 
      font-weight: 600; 
      text-transform: uppercase;
      margin: 10px 0;
    }
    .status-completed { 
      background: #00b894; 
      color: white;
    }
    .status-design { 
      background: #6c5ce7; 
      color: white;
    }
    .status-analysis { 
      background: #74b9ff; 
      color: white;
    }
    .total-cost { 
      text-align: center; 
      font-size: 2em; 
      font-weight: 700; 
      color: #27ae60; 
      margin: 20px 0; 
      padding: 20px; 
      background: #d1f2eb; 
      border-radius: 8px;
      border: 2px solid #27ae60;
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      padding: 20px; 
      border-top: 2px solid #ecf0f1; 
      color: #7f8c8d;
    }
    @media print {
      body { background: white; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${project.name}</h1>
      <p class="subtitle">${project.description}</p>
      <span class="status-badge status-${project.status}">${getStatusText(project.status)}</span>
    </div>

    <!-- Project Info -->
    <div class="section">
      <h2>📋 Информация о проекте</h2>
      <div class="grid">
        <div>
          <div class="info-item">
            <span class="info-label">Создан:</span>
            <span class="info-value">${new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Обновлен:</span>
            <span class="info-value">${new Date(project.updatedAt).toLocaleDateString('ru-RU')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Бюджет:</span>
            <span class="info-value">${project.budget.min.toLocaleString('ru-RU')} - ${project.budget.max.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
        <div>
          <div class="info-item">
            <span class="info-label">Статус:</span>
            <span class="info-value">${getStatusText(project.status)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Стили:</span>
            <span class="info-value">${project.preferredStyles.join(', ')}</span>
          </div>
          ${project.restrictions.length > 0 ? `
          <div class="info-item">
            <span class="info-label">Ограничения:</span>
            <span class="info-value">${project.restrictions.join(', ')}</span>
          </div>
          ` : ''}
        </div>
      </div>
    </div>

    ${includeAnalysis && project.roomAnalysis ? `
    <!-- Room Analysis -->
    <div class="section">
      <h2>🏠 Анализ комнаты</h2>
      
      <img src="${project.roomAnalysis.originalImage}" alt="Анализируемая комната" class="room-image">
      
      <div class="grid">
        <div>
          <h3>Основные характеристики</h3>
          <div class="info-item">
            <span class="info-label">Тип комнаты:</span>
            <span class="info-value">${getRoomTypeDisplay(project.roomAnalysis.roomType)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Площадь:</span>
            <span class="info-value">${project.roomAnalysis.dimensions.area} м²</span>
          </div>
          <div class="info-item">
            <span class="info-label">Размеры:</span>
            <span class="info-value">${project.roomAnalysis.dimensions.width} × ${project.roomAnalysis.dimensions.height} м</span>
          </div>
          <div class="info-item">
            <span class="info-label">Текущий стиль:</span>
            <span class="info-value">${project.roomAnalysis.currentStyle}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Освещение:</span>
            <span class="info-value">${project.roomAnalysis.lighting}</span>
          </div>
        </div>
        <div>
          <h3>Цветовая палитра</h3>
          <div class="color-palette">
            ${project.roomAnalysis.colors.map(color => `
              <div class="color-item">
                <div class="color-box" style="background-color: ${color}"></div>
                <span>${color}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="problems-opportunities">
        <div class="problem-list">
          <h4>⚠️ Выявленные проблемы</h4>
          <ul>
            ${project.roomAnalysis.problems.map(problem => `<li>${problem}</li>`).join('')}
          </ul>
        </div>
        <div class="opportunity-list">
          <h4>💡 Возможности улучшения</h4>
          <ul>
            ${project.roomAnalysis.opportunities.map(opportunity => `<li>${opportunity}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    ` : ''}

    ${project.designRecommendation ? `
    <!-- Design Recommendations -->
    <div class="section">
      <h2>🎨 Дизайн-решения</h2>
      
      <h3>Рекомендуемая мебель</h3>
      <div class="furniture-grid">
        ${project.designRecommendation.furniture.map(item => `
          <div class="furniture-item">
            <h4>${item.name}</h4>
            <p class="description">${item.description}</p>
            <div class="price">${item.price.toLocaleString('ru-RU')} ₽</div>
            <span class="priority-badge priority-${item.priority}">${item.priority}</span>
          </div>
        `).join('')}
      </div>

      <h3>Освещение</h3>
      <div class="furniture-grid">
        ${project.designRecommendation.lighting.map(item => `
          <div class="furniture-item">
            <h4>${item.name}</h4>
            <p class="description">${item.description}</p>
            <div class="price">${item.price.toLocaleString('ru-RU')} ₽</div>
          </div>
        `).join('')}
      </div>

      <h3>Декор</h3>
      <div class="furniture-grid">
        ${project.designRecommendation.decorations.map(item => `
          <div class="furniture-item">
            <h4>${item.name}</h4>
            <p class="description">${item.description}</p>
            <div class="price">${item.price.toLocaleString('ru-RU')} ₽</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${includeShoppingList && project.shoppingList && project.shoppingList.length > 0 ? `
    <!-- Shopping List -->
    <div class="section">
      <h2>🛒 Список покупок</h2>
      ${project.shoppingList.map(item => `
        <div class="shopping-item">
          <div>
            <div class="name">${item.name}</div>
            <div class="category">${item.category} • ${item.source}</div>
            <span class="priority-badge priority-${item.priority}">${item.priority}</span>
          </div>
          <div class="price">${(item.price * item.quantity).toLocaleString('ru-RU')} ₽</div>
        </div>
      `).join('')}
      
      <div class="total-cost">
        Общая стоимость: ${totalCost.toLocaleString('ru-RU')} ₽
      </div>
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p>Дизайн-проект создан с помощью RED AI</p>
      <p>Сгенерировано: ${new Date().toLocaleDateString('ru-RU')} в ${new Date().toLocaleTimeString('ru-RU')}</p>
    </div>
  </div>
</body>
</html>
  `
}

function getStatusText(status: string) {
  const statusMap = {
    draft: 'Черновик',
    analysis: 'Анализ',
    design: 'Дизайн',
    review: 'Проверка', 
    completed: 'Завершен'
  }
  return statusMap[status as keyof typeof statusMap] || status
} 