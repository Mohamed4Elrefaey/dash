"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("khatwa_user")
      return stored ? JSON.parse(stored) : null
    }
    return null
  })
  const router = useRouter()

  const login = useCallback(
    (username: string, password: string) => {
      if (username === "محمد احمد" && password === "12345678") {
        const userData: User = { name: "محمد احمد", role: "مدخل بيانات" }
        setUser(userData)
        sessionStorage.setItem("khatwa_user", JSON.stringify(userData))
        router.push("/dashboard")
        return true
      }
      return false
    },
    [router],
  )

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem("khatwa_user")
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
