"use client"

import { Search, Bell, ChevronDown, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

interface TopbarProps {
  userName: string
  userRole: string
}

const roleLabels: Record<string, string> = {
  admin: "مدير النظام",
  staff: "موظف",
  user: "مستخدم",
}

export function Topbar({ userName, userRole }: TopbarProps) {
  const { logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const displayRole = roleLabels[userRole] || userRole

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 relative">
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="ابحث هنا"
          className="w-full rounded-lg border border-border bg-background py-2 ps-11 pe-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="الإشعارات">
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {userName.charAt(0)}
            </div>
            <div className="hidden text-end sm:block">
              <p className="text-sm font-semibold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{displayRole}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showMenu ? "rotate-180" : ""}`} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute end-0 top-full z-20 mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-lg">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
