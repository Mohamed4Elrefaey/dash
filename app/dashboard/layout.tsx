"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Topbar } from "@/components/dashboard/topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main content area - comes first in RTL */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userName={user.name} userRole={user.role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      {/* Sidebar - right side in RTL */}
      <AppSidebar onLogout={logout} />
    </div>
  )
}
