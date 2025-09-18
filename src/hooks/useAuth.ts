import { useState, useEffect } from 'react'
import { User } from '@/types/auth'
import { AuthService } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
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

  const login = (authResponse: any) => {
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