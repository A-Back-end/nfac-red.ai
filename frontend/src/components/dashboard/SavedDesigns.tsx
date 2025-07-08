'use client'

import React, { useState, useEffect } from 'react'
import { Heart, Download, Trash2, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface SavedDesign {
  id: string
  name: string
  description: string
  designImage: string
  suggestions: {
    furniture: string[]
    colors: string[]
    lighting: string[]
    accessories: string[]
  }
  parameters: {
    designType: string
    roomType: string
    budget: string
  }
  createdAt: string
  updatedAt: string
  isFavorite: boolean
}

export function SavedDesigns() {
  const [designs, setDesigns] = useState<SavedDesign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null)

  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    try {
      const response = await fetch('/api/designs?userId=default')
      if (!response.ok) {
        throw new Error('Failed to fetch designs')
      }
      const result = await response.json()
      setDesigns(result.designs || [])
    } catch (error) {
      console.error('Error fetching designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (designId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch('/api/designs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: designId,
          isFavorite: !currentFavorite
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update favorite status')
      }

      // Update local state
      setDesigns(prev => prev.map(design => 
        design.id === designId 
          ? { ...design, isFavorite: !currentFavorite }
          : design
      ))
    } catch (error) {
      console.error('Error updating favorite:', error)
      alert('Failed to update favorite status')
    }
  }

  const deleteDesign = async (designId: string) => {
    if (!confirm('Are you sure you want to delete this design?')) {
      return
    }

    try {
      const response = await fetch(`/api/designs?id=${designId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete design')
      }

      // Remove from local state
      setDesigns(prev => prev.filter(design => design.id !== designId))
      
      // Close modal if deleted design was selected
      if (selectedDesign?.id === designId) {
        setSelectedDesign(null)
      }

      alert('Design deleted successfully!')
    } catch (error) {
      console.error('Error deleting design:', error)
      alert('Failed to delete design')
    }
  }

  const downloadDesign = (imageUrl: string, designName: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${designName.replace(/\s+/g, '-').toLowerCase()}.png`
    link.click()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Designs</CardTitle>
          <CardDescription>Loading your saved designs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Saved Designs ({designs.length})
          </CardTitle>
          <CardDescription>
            Your collection of AI-generated interior designs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {designs.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No saved designs yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Generate and save your first AI design to see it here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="group relative bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Design Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={design.designImage}
                      alt={design.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => setSelectedDesign(design)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => downloadDesign(design.designImage, design.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => deleteDesign(design.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Favorite indicator */}
                    {design.isFavorite && (
                      <div className="absolute top-2 right-2">
                        <Heart className="h-5 w-5 text-red-500 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Design Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1 truncate">
                      {design.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                      {design.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(design.createdAt)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={() => toggleFavorite(design.id, design.isFavorite)}
                      >
                        <Heart 
                          className={`h-3 w-3 ${
                            design.isFavorite 
                              ? 'text-red-500 fill-current' 
                              : 'text-slate-400'
                          }`} 
                        />
                      </Button>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {design.parameters.designType} • {design.parameters.roomType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Design Detail Modal */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedDesign.name}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDesign(null)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image */}
                <div className="relative h-80 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <Image
                    src={selectedDesign.designImage}
                    alt={selectedDesign.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                      Description
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedDesign.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                      Parameters
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <p><strong>Style:</strong> {selectedDesign.parameters.designType}</p>
                      <p><strong>Room:</strong> {selectedDesign.parameters.roomType}</p>
                      <p><strong>Budget:</strong> {selectedDesign.parameters.budget}</p>
                      <p><strong>Created:</strong> {formatDate(selectedDesign.createdAt)}</p>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                        Furniture
                      </h4>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {selectedDesign.suggestions.furniture?.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                        Colors
                      </h4>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {selectedDesign.suggestions.colors?.map((color, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                            {color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => toggleFavorite(selectedDesign.id, selectedDesign.isFavorite)}
                      variant="outline"
                    >
                      <Heart 
                        className={`mr-2 h-4 w-4 ${
                          selectedDesign.isFavorite 
                            ? 'text-red-500 fill-current' 
                            : 'text-slate-400'
                        }`} 
                      />
                      {selectedDesign.isFavorite ? 'Unfavorite' : 'Favorite'}
                    </Button>
                    <Button
                      onClick={() => downloadDesign(selectedDesign.designImage, selectedDesign.name)}
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 