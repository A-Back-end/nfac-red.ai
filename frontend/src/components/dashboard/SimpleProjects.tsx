'use client'

import React from 'react'
import { FolderOpen, Calendar, Star, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const mockProjects = [
  {
    id: 1,
    name: 'Modern Kitchen Design',
    description: 'Contemporary kitchen with island and minimalist style',
    lastModified: '2024-12-28',
    status: 'In Progress',
    favorite: true
  },
  {
    id: 2,
    name: 'Living Room Makeover',
    description: 'Cozy living space with warm color palette',
    lastModified: '2024-12-27',
    status: 'Completed',
    favorite: false
  },
  {
    id: 3,
    name: 'Bedroom Layout',
    description: 'Master bedroom with walk-in closet design',
    lastModified: '2024-12-26',
    status: 'Draft',
    favorite: true
  }
]

export function SimpleProjects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            My Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your interior design projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="card-hover cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                {project.favorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : project.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="mr-1 h-3 w-3" />
                  Modified {project.lastModified}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Start your first interior design project
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 