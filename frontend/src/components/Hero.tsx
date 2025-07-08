'use client'

import React from 'react'
import Link from 'next/link'
import { Star, Rocket, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { translations } from '@/lib/translations'

interface HeroProps {
  language: string
}

export function Hero({ language }: HeroProps) {
  const t = translations[language as keyof typeof translations]

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="hero-badge-new animate-fade-in">
          <Star className="h-4 w-4 text-blue-500" />
          <span className="text-slate-700 dark:text-slate-300">
            {t.hero_badge}
          </span>
      </div>

        {/* Title */}
        <h1 className="hero-title-new hero-title-gradient animate-fade-in-up animate-delay-200">
            {t.hero_title}
        </h1>

          {/* Subtitle */}
        <p className="hero-subtitle-new hero-subtitle-gradient animate-fade-in-up animate-delay-400">
          {t.hero_subtitle}
        </p>

          {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16 animate-fade-in-up animate-delay-600">
          <Link href="/dashboard">
            <Button className="btn-new bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/25 group">
              <Rocket className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              {t.hero_btn_primary}
            </Button>
          </Link>
          
          <button className="btn-new bg-white/10 dark:bg-slate-800/50 backdrop-blur-20 border border-slate-200/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 dark:hover:bg-slate-700/50 group">
            <Play className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            {t.hero_btn_secondary}
          </button>
        </div>

        {/* Hero Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number-new stat-number-gradient">
              {language === 'en' ? '10K+' : '10К+'}
            </span>
            <span className="stat-label-new stat-label-gradient">
              {language === 'en' ? 'Properties Analyzed' : 'Проанализированных объектов'}
            </span>
          </div>
          
          <div className="stat-item">
            <span className="stat-number-new stat-number-gradient">95%</span>
            <span className="stat-label-new stat-label-gradient">
              {language === 'en' ? 'Accuracy Rate' : 'Точность'}
            </span>
          </div>
          
          <div className="stat-item">
            <span className="stat-number-new stat-number-gradient">24/7</span>
            <span className="stat-label-new stat-label-gradient">
              {language === 'en' ? 'AI Support' : 'Поддержка ИИ'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 