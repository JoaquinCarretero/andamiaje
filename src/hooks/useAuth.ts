import { useState, useEffect } from 'react'
import { User, AuthResponse } from '@/types/auth'
import { AuthService } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = () => {
      try {
        // Primero verificar si hay token
        if (!AuthService.isAuthenticated()) {
          setUser(null)
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Obtener usuario del localStorage
        const currentUser = AuthService.getUser()
        setUser(currentUser)
        setIsAuthenticated(!!currentUser)
      } catch (error) {
        console.error('Error initializing auth:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (authResponse: AuthResponse) => {
    AuthService.setAuth(authResponse)
    setUser(authResponse.user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('authUser', JSON.stringify(updatedUser))
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser
  }
}