'use client'

import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Box, Plane } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Camera } from 'lucide-react'
import { ThreeDScene, FurnitureRecommendation } from '@/lib/types'
import { useTranslations } from '@/lib/translations'

interface ThreeDViewerProps {
  roomDimensions?: { width: number; height: number; depth?: number }
  furniture?: FurnitureRecommendation[]
  colorPalette?: {
    primary: string
    secondary: string
    accent: string
    neutral: string
  }
}

// Component for furniture objects
function FurnitureObject({ 
  furniture, 
  position = [0, 0, 0], 
  color = '#8b5cf6' 
}: { 
  furniture: FurnitureRecommendation
  position?: [number, number, number]
  color?: string 
}) {
  const meshRef = useRef<any>()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  const getGeometry = () => {
    const { dimensions } = furniture
    const { width, height, depth } = dimensions

    switch (furniture.category) {
      case 'sofa':
        return <boxGeometry args={[width, height * 0.6, depth]} />
      case 'table':
        return <boxGeometry args={[width, height * 0.1, depth]} />
      case 'chair':
        return <boxGeometry args={[width * 0.8, height, depth * 0.8]} />
      case 'bed':
        return <boxGeometry args={[width, height * 0.3, depth]} />
      default:
        return <boxGeometry args={[width, height, depth]} />
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={hovered ? '#fbbf24' : color} 
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

// Room walls and floor
function Room({ 
  dimensions, 
  colorPalette 
}: { 
  dimensions: { width: number; height: number; depth?: number }
  colorPalette?: any 
}) {
  const { width, height, depth = width } = dimensions
  
  return (
    <group>
      {/* Floor */}
      <Plane
        args={[width, depth]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={colorPalette?.neutral || '#f3f4f6'} />
      </Plane>

      {/* Back Wall */}
      <Plane
        args={[width, height]}
        position={[0, height / 2, -depth / 2]}
        receiveShadow
      >
        <meshStandardMaterial color={colorPalette?.secondary || '#e5e7eb'} />
      </Plane>

      {/* Left Wall */}
      <Plane
        args={[depth, height]}
        rotation={[0, Math.PI / 2, 0]}
        position={[-width / 2, height / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={colorPalette?.secondary || '#e5e7eb'} />
      </Plane>

      {/* Right Wall */}
      <Plane
        args={[depth, height]}
        rotation={[0, -Math.PI / 2, 0]}
        position={[width / 2, height / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={colorPalette?.secondary || '#e5e7eb'} />
      </Plane>
    </group>
  )
}

// Lighting setup
function Lighting() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light */}
      <pointLight position={[-10, 10, -10]} intensity={0.3} />
      
      {/* Accent light */}
      <spotLight
        position={[0, 15, 0]}
        intensity={0.5}
        angle={0.3}
        penumbra={0.2}
        castShadow
      />
    </>
  )
}

// Camera controls
function CameraController() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(8, 6, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

export default function ThreeDViewer({ 
  roomDimensions = { width: 6, height: 3, depth: 4 },
  furniture = [],
  colorPalette 
}: ThreeDViewerProps) {
  const { t } = useTranslations()
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'front'>('perspective')
  const [showGrid, setShowGrid] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const resetCamera = () => {
    // This would reset the camera position
    window.location.reload() // Simple reset for now
  }

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const link = document.createElement('a')
      link.download = 'room-3d-view.png'
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const furnitureColors = [
    '#8b5cf6', // purple
    '#059669', // green
    '#dc2626', // red
    '#d97706', // orange
    '#0891b2', // cyan
    '#7c3aed', // violet
  ]

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t('viewer_3d_title')}</h3>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Move3D className="w-4 h-4 mr-1" />
              {showGrid ? t('viewer_hide_grid') : t('viewer_show_grid')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetCamera}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {t('viewer_reset')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={takeScreenshot}
            >
              <Camera className="w-4 h-4 mr-1" />
              {t('viewer_snapshot')}
            </Button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-2">
          {(['perspective', 'top', 'front'] as const).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode)}
            >
              {mode === 'perspective' ? t('viewer_perspective') : mode === 'top' ? t('viewer_top') : t('viewer_front')}
            </Button>
          ))}
        </div>

        {/* 3D Canvas */}
        <div className="relative h-96 w-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
          <Canvas
            ref={canvasRef}
            shadows
            camera={{ 
              position: [8, 6, 8], 
              fov: 60,
              near: 0.1,
              far: 1000
            }}
          >
            <Suspense fallback={null}>
              <CameraController />
              <Lighting />
              
              {/* Room */}
              <Room dimensions={roomDimensions} colorPalette={colorPalette} />
              
              {/* Grid */}
              {showGrid && (
                <Grid
                  position={[0, 0.01, 0]}
                  args={[roomDimensions.width * 2, roomDimensions.depth || roomDimensions.width * 2]}
                  cellSize={0.5}
                  cellThickness={0.5}
                  cellColor="#6b7280"
                  sectionSize={2}
                  sectionThickness={1}
                  sectionColor="#374151"
                  fadeDistance={30}
                  fadeStrength={1}
                  infiniteGrid
                />
              )}
              
              {/* Furniture */}
              {furniture.map((item, index) => (
                <FurnitureObject
                  key={item.id}
                  furniture={item}
                  position={[
                    item.position.x - roomDimensions.width / 2,
                    item.position.y + item.dimensions.height / 2,
                    item.position.z - (roomDimensions.depth || roomDimensions.width) / 2
                  ]}
                  color={furnitureColors[index % furnitureColors.length]}
                />
              ))}
              
              {/* Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2.1}
              />
            </Suspense>
          </Canvas>
          
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('viewer_loading')}</p>
            </div>
          </div>
        </div>

        {/* Furniture Legend */}
        {furniture.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">{t('viewer_furniture_list')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {furniture.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: furnitureColors[index % furnitureColors.length] }}
                  ></div>
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>{t('viewer_controls_rotate')}</p>
          <p>{t('viewer_controls_zoom')}</p>
          <p>{t('viewer_controls_pan')}</p>
        </div>
      </div>
    </Card>
  )
} 