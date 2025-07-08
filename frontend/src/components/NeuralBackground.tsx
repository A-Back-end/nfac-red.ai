'use client'

import React, { useEffect, useState } from 'react'

interface NeuralBackgroundProps {
  theme?: 'light' | 'dark'
}

export function NeuralBackground({ theme }: NeuralBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    setMounted(true)
    
    // If theme prop is provided, use it, otherwise detect from document
    if (theme) {
      setCurrentTheme(theme)
    } else {
      // Auto-detect theme from document
      const detectTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        const documentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        const dataTheme = document.body.getAttribute('data-theme') as 'light' | 'dark'
        
        return savedTheme as 'light' | 'dark' || dataTheme || documentTheme
      }
      
      setCurrentTheme(detectTheme())
      
      // Watch for theme changes
      const observer = new MutationObserver(() => {
        setCurrentTheme(detectTheme())
      })
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme']
      })
      
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
      })
      
      return () => observer.disconnect()
    }
  }, [theme])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Background Gradient with smooth theme transition */}
      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        currentTheme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
      }`} />
      
      {/* Additional animated background layers */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        currentTheme === 'dark' ? 'opacity-100' : 'opacity-30'
      }`}>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Neural Network Animation */}
      <div className={`neural-network transition-all duration-500 ${
        currentTheme === 'dark' ? 'opacity-100' : 'opacity-60'
      }`}>
        <div className="neural-container">
          {/* Main neural nodes */}
          <div className="neuron" style={{ top: '15%', left: '20%', animationDelay: '0s' }}></div>
          <div className="neuron" style={{ top: '25%', left: '60%', animationDelay: '0.5s' }}></div>
          <div className="neuron" style={{ top: '35%', left: '30%', animationDelay: '1s' }}></div>
          <div className="neuron" style={{ top: '45%', left: '70%', animationDelay: '1.5s' }}></div>
          <div className="neuron" style={{ top: '55%', left: '15%', animationDelay: '2s' }}></div>
          <div className="neuron" style={{ top: '65%', left: '50%', animationDelay: '2.5s' }}></div>
          <div className="neuron" style={{ top: '75%', left: '80%', animationDelay: '0.3s' }}></div>
          <div className="neuron" style={{ top: '85%', left: '35%', animationDelay: '0.8s' }}></div>
          <div className="neuron" style={{ top: '20%', left: '85%', animationDelay: '1.3s' }}></div>
          <div className="neuron" style={{ top: '40%', left: '5%', animationDelay: '1.8s' }}></div>
          <div className="neuron" style={{ top: '60%', left: '90%', animationDelay: '2.3s' }}></div>
          <div className="neuron" style={{ top: '10%', left: '45%', animationDelay: '0.7s' }}></div>

          {/* Secondary nodes */}
          <div className="neuron secondary" style={{ top: '18%', left: '75%', animationDelay: '1.2s' }}></div>
          <div className="neuron secondary" style={{ top: '28%', left: '40%', animationDelay: '1.7s' }}></div>
          <div className="neuron secondary" style={{ top: '38%', left: '55%', animationDelay: '2.2s' }}></div>
          <div className="neuron secondary" style={{ top: '48%', left: '25%', animationDelay: '0.4s' }}></div>
          <div className="neuron secondary" style={{ top: '58%', left: '75%', animationDelay: '0.9s' }}></div>
          <div className="neuron secondary" style={{ top: '68%', left: '10%', animationDelay: '1.4s' }}></div>
          <div className="neuron secondary" style={{ top: '78%', left: '65%', animationDelay: '1.9s' }}></div>
          <div className="neuron secondary" style={{ top: '12%', left: '30%', animationDelay: '2.4s' }}></div>

          {/* Neural connections */}
          <div className="connection" style={{ top: '15%', left: '20%', width: '40%', transform: 'rotate(15deg)', animationDelay: '0s' }}></div>
          <div className="connection secondary" style={{ top: '25%', left: '30%', width: '30%', transform: 'rotate(-20deg)', animationDelay: '0.5s' }}></div>
          <div className="connection tertiary" style={{ top: '35%', left: '60%', width: '25%', transform: 'rotate(45deg)', animationDelay: '1s' }}></div>
          <div className="connection" style={{ top: '45%', left: '15%', width: '55%', transform: 'rotate(-10deg)', animationDelay: '1.5s' }}></div>
          <div className="connection secondary" style={{ top: '55%', left: '50%', width: '35%', transform: 'rotate(30deg)', animationDelay: '2s' }}></div>
          <div className="connection tertiary" style={{ top: '65%', left: '35%', width: '45%', transform: 'rotate(-35deg)', animationDelay: '2.5s' }}></div>
          <div className="connection" style={{ top: '75%', left: '20%', width: '60%', transform: 'rotate(8deg)', animationDelay: '0.3s' }}></div>
          <div className="connection secondary" style={{ top: '85%', left: '5%', width: '30%', transform: 'rotate(-25deg)', animationDelay: '0.8s' }}></div>
          <div className="connection tertiary" style={{ top: '20%', left: '45%', width: '40%', transform: 'rotate(60deg)', animationDelay: '1.3s' }}></div>
          <div className="connection" style={{ top: '40%', left: '70%', width: '20%', transform: 'rotate(-45deg)', animationDelay: '1.8s' }}></div>
          <div className="connection secondary" style={{ top: '60%', left: '50%', width: '40%', transform: 'rotate(15deg)', animationDelay: '2.3s' }}></div>
          <div className="connection tertiary" style={{ top: '10%', left: '75%', width: '15%', transform: 'rotate(-60deg)', animationDelay: '0.7s' }}></div>

          {/* Additional vertical connections */}
          <div className="connection" style={{ top: '15%', left: '30%', width: '20%', transform: 'rotate(90deg)', animationDelay: '1.1s' }}></div>
          <div className="connection secondary" style={{ top: '35%', left: '50%', width: '30%', transform: 'rotate(90deg)', animationDelay: '1.6s' }}></div>
          <div className="connection tertiary" style={{ top: '55%', left: '70%', width: '25%', transform: 'rotate(90deg)', animationDelay: '2.1s' }}></div>
          <div className="connection" style={{ top: '25%', left: '80%', width: '40%', transform: 'rotate(90deg)', animationDelay: '0.6s' }}></div>

          {/* Branching elements */}
          <div className="branch" style={{ top: '20%', left: '40%', transform: 'rotate(30deg)', animationDelay: '0.2s' }}></div>
          <div className="branch" style={{ top: '50%', left: '60%', transform: 'rotate(-45deg)', animationDelay: '1.2s' }}></div>
          <div className="branch" style={{ top: '70%', left: '20%', transform: 'rotate(60deg)', animationDelay: '2.2s' }}></div>
          <div className="branch" style={{ top: '30%', left: '80%', transform: 'rotate(-30deg)', animationDelay: '0.9s' }}></div>

          {/* Neural clusters */}
          <div className="cluster" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
          <div className="cluster" style={{ top: '40%', right: '15%', animationDelay: '2s' }}></div>
          <div className="cluster" style={{ bottom: '20%', left: '60%', animationDelay: '4s' }}></div>
        </div>
      </div>
    </div>
  )
} 