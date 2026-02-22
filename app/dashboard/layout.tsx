"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Topbar } from "@/components/dashboard/topbar"

interface User {
  name: string
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem("khatwa_user")
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      router.push("/")
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("khatwa_user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main content area - comes first in RTL */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userName={user.name} userRole={user.role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      {/* Sidebar - right side in RTL */}
      <AppSidebar onLogout={handleLogout} />
    </div>
  )
}
