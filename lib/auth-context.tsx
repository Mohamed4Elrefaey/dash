"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getToken, getStoredUser, removeToken } from "@/lib/api-client"
import { authRepository } from "@/lib/repositories/auth.repository"
import { type User } from "@/lib/models/auth.model"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    const storedUser = getStoredUser()
    if (token && storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authRepository.login({ email, password })
      const userData: User = response.user
      setUser(userData)
      router.push("/dashboard")
    },
    [router],
  )

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user && !!getToken(), isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
