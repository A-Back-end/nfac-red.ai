import { NextRequest, NextResponse } from 'next/server'
import { AzureOpenAI } from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

// Проверяем наличие переменных окружения (с фоллбэками на рабочие ключи)
const azureApiKey = process.env.AZURE_OPENAI_API_KEY || 
                   process.env.AZURE_OPENAI_KEY_1 || 
                   "YOUR_AZURE_OPENAI_API_KEY_HERE"
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://neuroflow-hub.openai.azure.com/"
const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview"
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || process.env.DEPLOYMENT_NAME || "gpt-4.1"

if (!azureApiKey || !azureEndpoint || !azureApiVersion || !deployment) {
  console.error('Missing Azure OpenAI configuration:', {
    hasApiKey: !!azureApiKey,
    hasEndpoint: !!azureEndpoint,
    hasApiVersion: !!azureApiVersion,
    hasDeployment: !!deployment
  })
}

// Инициализация Azure OpenAI с переменными окружения
const client = azureApiKey && azureEndpoint ? new AzureOpenAI({
  apiKey: azureApiKey,
  endpoint: azureEndpoint,
  apiVersion: azureApiVersion || '2024-04-01-preview',
}) : null

// Краткий системный промпт для ассистента
const systemPrompt = `Вы — AI помощник платформы RED.AI. Отвечайте понятно, структурированно и дружелюбно. Помогайте пользователю, давайте практические советы.`

export async function POST(request: NextRequest) {
  try {
    // Проверяем конфигурацию
    if (!client || !deployment) {
      return NextResponse.json({ 
        error: 'Azure OpenAI не настроен. Проверьте переменные окружения AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT' 
      }, { status: 500 })
    }

    const { message } = await request.json()
    if (!message) {
      return NextResponse.json({ error: 'Поле message обязательно' }, { status: 400 })
    }

    // Формируем сообщения для Azure OpenAI
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: String(message) }
    ]

    // Запрос к Azure OpenAI GPT-4.1
    const completion = await client.chat.completions.create({
      model: deployment,
      messages,
      max_tokens: 1200,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
      stream: false
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: 'Не удалось получить ответ от Azure AI' }, { status: 500 })
    }

    // Возвращаем ответ в формате, который ожидает frontend
    return NextResponse.json({
      message: response,
      usage: completion.usage,
      model: `Azure ${deployment}`,
      provider: 'Azure OpenAI'
    })
  } catch (error: any) {
    console.error('Azure AI Chat Error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Ошибка Azure OpenAI',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
} 