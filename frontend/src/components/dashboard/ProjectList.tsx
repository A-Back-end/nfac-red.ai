'use client'

import React, { useState } from 'react'
import { FolderOpen, Trash2, Eye, Calendar, Image as ImageIcon, Edit2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { useAppStore } from '../../../../lib/store'
import { formatFileSize, truncateText, cn } from '../../../../lib/utils'
import toast from 'react-hot-toast'

/**
 * Project List Component
 * Displays and manages saved design projects
 */
export function ProjectList() {
  const { projects, deleteProject, setCurrentProject, currentProject } = useAppStore()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  /**
   * Handle project deletion with confirmation
   */
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
      toast.success('Project deleted successfully')
      
      if (selectedProject === projectId) {
        setSelectedProject(null)
      }
    }
  }

  /**
   * Handle project selection
   */
  const handleSelectProject = (project: any) => {
    setSelectedProject(project.id)
    setCurrentProject(project)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>My Design Projects</span>
          </CardTitle>
          <CardDescription>
            Manage your saved floor plan analyses and design projects
          </CardDescription>
        </CardHeader>
      </Card>

      {projects.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No projects yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Upload a floor plan and analyze it to create your first project
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2 space-y-4">
            {projects.map((project: any) => (
              <Card
                key={project.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedProject === project.id
                    ? "ring-2 ring-primary-500 border-primary-200"
                    : ""
                )}
                onClick={() => handleSelectProject(project)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Project Image */}
                    <div className="flex-shrink-0">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {truncateText(project.description, 100)}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              handleSelectProject(project)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              handleDeleteProject(project.id)
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Project Meta */}
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Edit2 className="h-4 w-4" />
                          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project Details Sidebar */}
          <div className="space-y-6">
            {selectedProject ? (
              (() => {
                const project = projects.find((p: any) => p.id === selectedProject)
                if (!project) return null

                return (
                  <>
                    {/* Project Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Image Preview */}
                        {project.image && (
                          <div>
                            <img
                              src={project.image}
                              alt={project.name}
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                          </div>
                        )}

                        {/* Project Info */}
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {project.description}
                          </p>
                        </div>

                        {/* Timestamps */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Created:</span>
                            <span className="text-gray-900 dark:text-white">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Updated:</span>
                            <span className="text-gray-900 dark:text-white">
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Analysis Results */}
                    {project.roomAnalysis && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">AI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none">
                            <p>Room Type: {project.roomAnalysis.roomType}</p>
                            <p>Current Style: {project.roomAnalysis.currentStyle}</p>
                            <p>Dimensions: {project.roomAnalysis.dimensions.width}×{project.roomAnalysis.dimensions.height}m</p>
                            <p>Area: {project.roomAnalysis.dimensions.area} m²</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Set as current project for context
                            setCurrentProject(project)
                            toast.success('Project set as current context')
                          }}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Set as Current
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Project
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )
              })()
            ) : (
              /* No Selection */
              <Card>
                <CardContent className="text-center py-8">
                  <Eye className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Select a project to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Project Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Project Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {projects.length}
              </div>
              <p className="text-sm text-gray-500">Total Projects</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {projects.filter((p: any) => p.roomAnalysis).length}
              </div>
              <p className="text-sm text-gray-500">Analyzed Projects</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {projects.filter((p: any) => 
                  new Date(p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                ).length}
              </div>
              <p className="text-sm text-gray-500">This Week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 