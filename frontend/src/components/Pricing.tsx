'use client'

import React from 'react'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { translations } from '@/lib/translations'

interface PricingProps {
  language: string
}

export function Pricing({ language }: PricingProps) {
  const t = translations[language as keyof typeof translations]

  const plans = [
    {
      name: t.pricing_starter,
      price: 'Free',
      period: t.pricing_per_month,
      description: language === 'en' ? 'Perfect for getting started' : 'Идеально для начала',
      features: [
        t.starter_feature_1,
        t.starter_feature_2,
        t.starter_feature_3,
        t.starter_feature_4,
      ],
      cta: t.pricing_get_started,
      popular: false,
    },
    {
      name: t.pricing_professional,
      price: '$9.99',
      period: t.pricing_per_month,
      description: language === 'en' ? 'For professionals and small teams' : 'Для профессионалов и небольших команд',
      features: [
        t.pro_feature_1,
        t.pro_feature_2,
        t.pro_feature_3,
        t.pro_feature_4,
        t.pro_feature_5,
      ],
      cta: t.pricing_get_started,
      popular: true,
    },
    {
      name: t.pricing_enterprise,
      price: '$199.99',
      period: t.pricing_per_month,
      description: language === 'en' ? 'For large organizations' : 'Для крупных организаций',
      features: [
        t.enterprise_feature_1,
        t.enterprise_feature_2,
        t.enterprise_feature_3,
        t.enterprise_feature_4,
        t.enterprise_feature_5,
      ],
      cta: t.pricing_contact_sales,
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 gradient-text">
            {t.pricing_title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.pricing_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`pricing-card relative overflow-hidden animate-on-scroll ${
                plan.popular
                  ? 'border-2 border-blue-500 dark:border-blue-400 shadow-xl scale-105'
                  : 'border border-slate-200 dark:border-slate-700'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2 text-sm font-semibold">
                  <Star className="inline-block h-4 w-4 mr-1" />
                  {t.pricing_most_popular}
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== 'Free' && (
                    <span className="text-slate-600 dark:text-slate-400 ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.cta === t.pricing_contact_sales ? '#contact' : '/dashboard'}>
                  <Button
                    className={`w-full py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12 animate-on-scroll">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {language === 'en' 
              ? 'All plans include 24/7 support and 30-day money-back guarantee' 
              : 'Все планы включают поддержку 24/7 и 30-дневную гарантию возврата денег'
            }
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              {language === 'en' ? 'No setup fees' : 'Без платы за установку'}
            </span>
            <span className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              {language === 'en' ? 'Cancel anytime' : 'Отмена в любое время'}
            </span>
            <span className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              {language === 'en' ? 'Secure payments' : 'Безопасные платежи'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 