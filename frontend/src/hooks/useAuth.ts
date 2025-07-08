import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    // Simulate auth check - в продакшене здесь будет реальная проверка
    const checkAuth = async () => {
      try {
        // Проверяем localStorage или делаем запрос к API
        const token = localStorage.getItem('auth-token')
        if (token) {
          // В реальном приложении здесь был бы запрос к API для проверки токена
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true
          })
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          })
        }
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Имитация API вызова
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true
        })
        
        return { success: true }
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    })
  }

  const register = async (email: string, password: string, name?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true
        })
        
        return { success: true }
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Registration failed' }
    }
  }

  return {
    ...authState,
    login,
    logout,
    register
  }
} 