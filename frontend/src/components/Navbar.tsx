'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brain, Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/translations'
import { useAppStore } from '@/lib/store'

interface NavbarProps {
  theme: string
  onThemeToggle: () => void
}

export function Navbar({ theme, onThemeToggle }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Используем систему переводов
  const { t, language, setLanguage } = useTranslations()
  
  // Синхронизируем с глобальным store
  const { setLanguage: setStoreLanguage } = useAppStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLanguageChange = (lang: 'en' | 'ru') => {
    setLanguage(lang)
    setStoreLanguage(lang)
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-20 border-b border-slate-200 dark:border-slate-700' 
          : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
              <span className="gradient-text">RED AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="nav-link text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm px-3 py-2 rounded-lg">
              {t('nav_features')}
            </a>
            <a href="#how-it-works" className="nav-link text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm px-3 py-2 rounded-lg">
              {t('nav_how_it_works')}
            </a>
            <a href="#pricing" className="nav-link text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm px-3 py-2 rounded-lg">
              {t('nav_pricing')}
            </a>
            <a href="#contact" className="nav-link text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm px-3 py-2 rounded-lg">
              {t('nav_contact')}
            </a>
            
            {/* Language Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('ru')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  language === 'ru'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                RU
              </button>
          </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="w-9 h-9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all duration-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-5 py-2 text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {t('nav_get_started')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
            <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-20">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                {t('nav_features')}
              </a>
              <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                {t('nav_how_it_works')}
              </a>
              <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                {t('nav_pricing')}
              </a>
              <a href="#contact" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                {t('nav_contact')}
              </a>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      language === 'en'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ru')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      language === 'ru'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    RU
                  </button>
                </div>

                <button
                  onClick={onThemeToggle}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>

              <Link href="/login" className="pt-2">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl">
                  {t('nav_get_started')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 