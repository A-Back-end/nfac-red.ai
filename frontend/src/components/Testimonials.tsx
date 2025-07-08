'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { translations } from '@/lib/translations'

interface TestimonialsProps {
  language: string
}

export function Testimonials({ language }: TestimonialsProps) {
  const t = translations[language as keyof typeof translations]

  const testimonials = [
    {
      content: t.testimonial_1,
      author: t.testimonial_1_author,
      role: t.testimonial_1_role,
      avatar: 'SA',
      rating: 5,
    },
    {
      content: t.testimonial_2,
      author: t.testimonial_2_author,
      role: t.testimonial_2_role,
      avatar: 'MJ',
      rating: 5,
    },
    {
      content: t.testimonial_3,
      author: t.testimonial_3_author,
      role: t.testimonial_3_role,
      avatar: 'EM',
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 gradient-text">
            {t.testimonials_title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.testimonials_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="testimonial-card animate-on-scroll hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-6 w-6 text-blue-500 mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 text-center animate-on-scroll">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'en' ? 'Happy Customers' : 'Довольных клиентов'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">4.9★</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'en' ? 'Average Rating' : 'Средний рейтинг'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50M+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'en' ? 'Plans Analyzed' : 'Планов проанализировано'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'en' ? 'AI Support' : 'Поддержка ИИ'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 