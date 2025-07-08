#!/usr/bin/env node

/**
 * Тестирование API endpoints для генерации изображений RED AI
 * Тестирует два endpoint: /api/dalle-generator и /api/generate-design
 */

const API_BASE_URL = 'http://localhost:3000';

// Тестовые данные
const testPrompts = [
  {
    prompt: 'Современная гостиная с минималистичной мебелью, большими окнами и естественным освещением',
    style: 'modern',
    roomType: 'living',
    budgetLevel: 'medium'
  },
  {
    prompt: 'Уютная спальня в скандинавском стиле с деревянной кроватью и текстилем',
    style: 'scandinavian', 
    roomType: 'bedroom',
    budgetLevel: 'high'
  },
  {
    prompt: 'Функциональная кухня в стиле лофт с кирпичными стенами и металлическими элементами',
    style: 'industrial',
    roomType: 'kitchen',
    budgetLevel: 'low'
  }
];

/**
 * Тестирование простого DALL-E endpoint
 */
async function testDalleGenerator(testData) {
  console.log('\n🎨 Тестирование /api/dalle-generator...');
  console.log('━'.repeat(50));
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE_URL}/api/dalle-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testData,
        quality: 'standard',
        size: '1024x1024',
        dalleStyle: 'natural'
      })
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`⏱️  Время выполнения: ${duration}s`);
    console.log(`🌐 Статус ответа: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Ошибка:', errorData);
      return false;
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Успешная генерация!');
      console.log(`🖼️  URL изображения: ${result.imageUrl}`);
      console.log(`💰 Стоимость: ${result.metadata.estimatedCost}`);
      console.log(`🎯 Модель: ${result.metadata.model}`);
      console.log(`📏 Размер: ${result.metadata.size}`);
      console.log(`🎨 Качество: ${result.metadata.quality}`);
      
      if (result.metadata.revisedPrompt) {
        console.log(`✨ Улучшенный промпт: ${result.metadata.revisedPrompt.substring(0, 100)}...`);
      }
      
      return true;
    } else {
      console.log('❌ Генерация не удалась:', result.error);
      return false;
    }

  } catch (error) {
    console.log('💥 Ошибка запроса:', error.message);
    return false;
  }
}

/**
 * Тестирование комплексного design endpoint
 */
async function testGenerateDesign(testData) {
  console.log('\n🏗️  Тестирование /api/generate-design...');
  console.log('━'.repeat(50));
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE_URL}/api/generate-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testData,
        quality: 'standard',
        mode: 'generate',
        referenceImages: []
      })
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`⏱️  Время выполнения: ${duration}s`);
    console.log(`🌐 Статус ответа: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Ошибка:', errorData);
      return false;
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Успешная генерация!');
      console.log(`🖼️  URL изображения: ${result.imageUrl}`);
      console.log(`💰 Стоимость: ${result.metadata.estimatedCost}`);
      console.log(`🎯 Режим генерации: ${result.metadata.generationMode}`);
      
      if (result.furniture && result.furniture.length > 0) {
        console.log(`🪑 Рекомендуемая мебель: ${result.furniture.length} предметов`);
        result.furniture.slice(0, 3).forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.name} - ${item.price} (${item.category})`);
        });
      }
      
      if (result.pinterestStyles && result.pinterestStyles.length > 0) {
        console.log(`📌 Pinterest стили: ${result.pinterestStyles.length} вариантов`);
        result.pinterestStyles.forEach((style, index) => {
          console.log(`   ${index + 1}. ${style.name} - ${style.description}`);
        });
      }
      
      return true;
    } else {
      console.log('❌ Генерация не удалась:', result.error);
      return false;
    }

  } catch (error) {
    console.log('💥 Ошибка запроса:', error.message);
    return false;
  }
}

/**
 * Тестирование health check
 */
async function testHealthCheck() {
  console.log('\n🏥 Проверка состояния DALL-E endpoint...');
  console.log('━'.repeat(50));
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/dalle-generator`, {
      method: 'GET'
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ DALL-E endpoint доступен');
      console.log(`📋 Версия: ${result.version}`);
      console.log(`🤖 Модели: ${result.models?.join(', ')}`);
      console.log(`📏 Размеры: ${result.supportedSizes?.join(', ')}`);
      return true;
    } else {
      console.log('❌ DALL-E endpoint недоступен');
      return false;
    }
  } catch (error) {
    console.log('💥 Ошибка подключения:', error.message);
    return false;
  }
}

/**
 * Главная функция тестирования
 */
async function runTests() {
  console.log('🧪 RED AI Image Generator - Тестирование API Endpoints');
  console.log('='.repeat(60));
  
  // Проверка доступности endpoints
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    console.log('\n❌ Сервер недоступен. Убедитесь что приложение запущено на порту 3000');
    process.exit(1);
  }

  let successCount = 0;
  let totalTests = 0;

  // Тестирование каждого промпта на обоих endpoints
  for (let i = 0; i < testPrompts.length; i++) {
    const testData = testPrompts[i];
    
    console.log(`\n📝 Тест ${i + 1}: ${testData.style} ${testData.roomType}`);
    console.log(`   Промпт: "${testData.prompt.substring(0, 60)}..."`);
    
    // Тест простого endpoint
    totalTests++;
    const dalleSuccess = await testDalleGenerator(testData);
    if (dalleSuccess) successCount++;
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Тест комплексного endpoint
    totalTests++;
    const designSuccess = await testGenerateDesign(testData);
    if (designSuccess) successCount++;
    
    // Пауза между тестами
    if (i < testPrompts.length - 1) {
      console.log('\n⏳ Пауза 5 секунд перед следующим тестом...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Итоговые результаты
  console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ');
  console.log('='.repeat(60));
  console.log(`✅ Успешных тестов: ${successCount}/${totalTests}`);
  console.log(`📈 Процент успеха: ${Math.round((successCount / totalTests) * 100)}%`);
  
  if (successCount === totalTests) {
    console.log('🎉 Все тесты пройдены успешно!');
    console.log('🚀 RED AI Image Generator готов к использованию');
  } else {
    console.log('⚠️  Некоторые тесты не прошли');
    console.log('🔧 Проверьте логи ошибок и настройки API ключей');
  }

  console.log('\n💡 Советы по использованию:');
  console.log('   • Используйте quality: "standard" для экономии');
  console.log('   • Добавляйте детали в промпты для лучших результатов');
  console.log('   • Сохраненные изображения находятся в public/generated-images/');
  console.log('   • Мониторьте расходы на OpenAI API');
}

// Запуск тестов
if (require.main === module) {
  runTests().catch(error => {
    console.error('💥 Критическая ошибка:', error);
    process.exit(1);
  });
}

module.exports = {
  testDalleGenerator,
  testGenerateDesign,
  testHealthCheck,
  runTests
}; 