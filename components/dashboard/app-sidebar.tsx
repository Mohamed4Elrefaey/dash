"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutGrid,
  Baby,
  Syringe,
  Stethoscope,
  FileText,
  Bot,
  Bell,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"

const mainMenuItems = [
  { label: "نظرة عامة", href: "/dashboard", icon: LayoutGrid },
  { label: "ادارة الاطفال", href: "/dashboard/children", icon: Baby },
  { label: "ادارة التطعيمات", href: "/dashboard/vaccinations", icon: Syringe },
  { label: "دليل الاطباء و العيادات", href: "/dashboard/doctors", icon: Stethoscope },
]

const systemMenuItems = [
  { label: "ادارة المحتوى", href: "/dashboard/content", icon: FileText },
  { label: "ادارة المحادثة الالية", href: "/dashboard/chatbot", icon: Bot },
  { label: "الاشعارات", href: "/dashboard/notifications", icon: Bell },
]

const reportsMenuItems = [
  { label: "ادارة الموظفين", href: "/dashboard/staff", icon: Users, roles: ["super_admin"] },
  { label: "التقارير و التحليلات", href: "/dashboard/reports", icon: BarChart3 },
  { label: "اعدادات النظام", href: "/dashboard/settings", icon: Settings },
]

interface AppSidebarProps {
  onLogout: () => void
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const renderItem = (item: { label: string; href: string; icon: React.ElementType; roles?: string[] }) => {
    if (item.roles && (!user?.role || !item.roles.includes(user.role))) return null

    const Icon = item.icon
    const active = isActive(item.href)

    return (
      <li key={item.label}>
        <Link
          href={item.href}
          className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
            active
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span>{item.label}</span>
          {active && <span className="ms-auto h-2 w-2 rounded-full bg-primary-foreground" />}
        </Link>
      </li>
    )
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-s border-border bg-card">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Baby className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">خطوة</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-4 text-xs font-semibold text-muted-foreground">القائمة الرئيسية</p>
        <ul className="space-y-1">
          {mainMenuItems.map(renderItem)}
        </ul>

        <p className="mb-2 mt-6 px-4 text-xs font-semibold text-muted-foreground">المحتوى و النظام</p>
        <ul className="space-y-1">
          {systemMenuItems.map(renderItem)}
        </ul>

        <p className="mb-2 mt-6 px-4 text-xs font-semibold text-muted-foreground">التقارير و الاعدادات</p>
        <ul className="space-y-1">
          {reportsMenuItems.map(renderItem)}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-border px-3 py-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
