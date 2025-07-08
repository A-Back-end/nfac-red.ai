'use client'

import React from 'react'
import { Zap, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { useAppStore } from '../../../../lib/store'
import { formatTokenCount, calculateTokenCost } from '../../../../lib/utils'

interface TokenUsageTrackerProps {
  compact?: boolean
}

/**
 * Token Usage Tracker Component
 * Displays current token usage, costs, and provides usage reset functionality
 */
export function TokenUsageTracker({ compact = false }: TokenUsageTrackerProps) {
  const { totalTokensUsed, totalCost, resetTokenUsage } = useAppStore()

  // Calculate monthly estimate based on current usage
  const dailyAverage = totalCost / new Date().getDate()
  const monthlyEstimate = dailyAverage * 30

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Tokens Used</span>
          <span className="font-medium">{formatTokenCount(totalTokensUsed)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Total Cost</span>
          <span className="font-medium text-green-600">${totalCost.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalCost / 10) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          ${(10 - totalCost).toFixed(2)} remaining this month
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTokenCount(totalTokensUsed)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Estimate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyEstimate.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Based on current usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Breakdown</CardTitle>
          <CardDescription>
            Detailed breakdown of your OpenAI API usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GPT-4 Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>GPT-4 Turbo (Chat)</span>
              <span>${(totalCost * 0.6).toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: '60%' }}
              />
            </div>
          </div>

          {/* GPT-4 Vision Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>GPT-4 Vision (Image Analysis)</span>
              <span>${(totalCost * 0.3).toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: '30%' }}
              />
            </div>
          </div>

          {/* Stable Diffusion XL Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Stable Diffusion XL (Image Generation)</span>
              <span>${(totalCost * 0.1).toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: '10%' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
          <CardDescription>
            Tips to optimize your API usage and reduce costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Use specific prompts to get better results with fewer tokens</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Resize images before uploading for vision analysis</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Use the backend API for cached results when possible</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500">•</span>
              <span>Set up usage alerts to monitor spending</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Reset Usage Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={resetTokenUsage}
          className="text-red-600 hover:text-red-700"
        >
          Reset Usage Stats
        </Button>
      </div>
    </div>
  )
} 