#!/bin/bash

echo "🆓 AI Room Analyzer - Free Version Setup"
echo "========================================"

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js версии 18+ с https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Убедитесь, что npm установлен"
    exit 1
fi

echo "✅ npm найден: $(npm --version)"

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей"
    exit 1
fi

echo "✅ Зависимости установлены"

# Проверяем, есть ли .env.local
if [ ! -f ".env.local" ]; then
    echo "📝 Создаем базовый .env.local файл..."
    echo "# AI Room Analyzer - Free Version" > .env.local
    echo "# No API keys required!" >> .env.local
    echo "NEXT_PUBLIC_APP_MODE=free" >> .env.local
fi

echo "🚀 Запускаем приложение..."
echo ""
echo "🌐 Приложение будет доступно по адресу:"
echo "   http://localhost:3000"
echo ""
echo "📱 Откройте браузер и перейдите в Dashboard → Room Analyzer"
echo ""
echo "🎯 Функции бесплатной версии:"
echo "   • Анализ комнат без ограничений"
echo "   • Дизайн-рекомендации"
echo "   • База товаров IKEA"
echo "   • Нет необходимости в API ключах"
echo ""

# Запускаем в режиме разработки
npm run dev 