import { NextRequest, NextResponse } from 'next/server'
import { Project } from '@/lib/types'

// В продакшене это была бы база данных (PostgreSQL, MongoDB, etc.)
let PROJECTS_DB: Project[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    
    if (projectId) {
      // Get specific project
      const project = PROJECTS_DB.find(p => p.id === projectId)
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, project })
    }
    
    if (userId) {
      // Get all projects for user
      const userProjects = PROJECTS_DB.filter(p => p.userId === userId)
      return NextResponse.json({ 
        success: true, 
        projects: userProjects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      })
    }
    
    return NextResponse.json({ error: 'userId or projectId required' }, { status: 400 })
    
  } catch (error: any) {
    console.error('Get projects error:', error)
    return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()
    
    const newProject: Project = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: projectData.userId || 'anonymous',
      name: projectData.name || 'Новый проект',
      description: projectData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: projectData.status || 'draft',
      generatedImages: projectData.generatedImages || [],
      budget: projectData.budget || { min: 50000, max: 200000 },
      preferredStyles: projectData.preferredStyles || ['modern'],
      restrictions: projectData.restrictions || [],
      
      // Room analysis data
      roomAnalysis: projectData.roomAnalysis || null,
      
      // Design recommendation data  
      designRecommendation: projectData.designRecommendation || null,
      
      // 3D Model data
      threeDModel: projectData.threeDModel || null,
      
      // Export data
      pdfReport: projectData.pdfReport || null,
      shoppingList: projectData.shoppingList || null
    }
    
    PROJECTS_DB.push(newProject)
    
    console.log('Created new project:', newProject.id, {
      hasRoomAnalysis: !!newProject.roomAnalysis,
      hasDesignRecommendation: !!newProject.designRecommendation,
      status: newProject.status
    })
    
    return NextResponse.json({
      success: true,
      project: newProject
    })
    
  } catch (error: any) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { projectId, ...updateData } = await request.json()
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }
    
    const projectIndex = PROJECTS_DB.findIndex(p => p.id === projectId)
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Update project with new data
    PROJECTS_DB[projectIndex] = {
      ...PROJECTS_DB[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    console.log('Updated project:', projectId, {
      hasRoomAnalysis: !!PROJECTS_DB[projectIndex].roomAnalysis,
      hasDesignRecommendation: !!PROJECTS_DB[projectIndex].designRecommendation,
      status: PROJECTS_DB[projectIndex].status
    })
    
    return NextResponse.json({
      success: true,
      project: PROJECTS_DB[projectIndex]
    })
    
  } catch (error: any) {
    console.error('Update project error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }
    
    const projectIndex = PROJECTS_DB.findIndex(p => p.id === projectId)
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Remove project
    const deletedProject = PROJECTS_DB[projectIndex]
    PROJECTS_DB.splice(projectIndex, 1)
    
    console.log('Deleted project:', projectId)
    
    return NextResponse.json({ success: true, deletedProject })
    
  } catch (error: any) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
} 