'use client'

import React from 'react'
import Image from 'next/image'
import { translations } from '@/lib/translations'

interface LogoShowcaseProps {
  language: string
}

export function LogoShowcase({ language }: LogoShowcaseProps) {
  const t = translations[language as keyof typeof translations]

  const images = [
    '/img/img-1.jpg', '/img/img-2.jpg', '/img/img-3.jpg', '/img/img-4.jpg', '/img/img-5.jpg', '/img/img-6.jpg',
    '/img/img-7.jpg', '/img/img-8.jpg', '/img/img-9.jpg', '/img/img-10.jpg', '/img/img-11.jpg', '/img/img-12.jpg',
    '/img/img-13.jpg', '/img/img-14.jpg', '/img/img-15.jpg', '/img/img-16.jpg', '/img/img-17.jpg', '/img/img-18.jpg'
  ]

  return (
    <section className="py-16 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 gradient-text">
            {language === 'en' ? 'Viral Thumbnails & Designs in Seconds' : 'Вирусные миниатюры и дизайны за секунды'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join thousands of professionals who trust RED AI for their real estate needs' 
              : 'Присоединяйтесь к тысячам профессионалов, которые доверяют RED AI в вопросах недвижимости'
            }
          </p>
        </div>
        
        <div className="overflow-hidden">
          {/* First Row - Moving Right */}
          <div className="flex animate-marquee-right mb-8 gap-6">
            {images.slice(0, 9).concat(images.slice(0, 9)).map((src, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 w-48 h-32">
                <div className="glass-effect rounded-2xl p-2 h-full hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
                    <Image
                      src={src}
                      alt={`Design ${index + 1}`}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        // Fallback for missing images
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                      Design {(index % 9) + 1}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second Row - Moving Left */}
          <div className="flex animate-marquee-left gap-6">
            {images.slice(9, 18).concat(images.slice(9, 18)).map((src, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 w-48 h-32">
                <div className="glass-effect rounded-2xl p-2 h-full hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
                    <Image
                      src={src}
                      alt={`Design ${index + 10}`}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        // Fallback for missing images
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                      Design {(index % 9) + 10}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 