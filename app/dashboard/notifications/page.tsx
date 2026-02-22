"use client"

import { useState, useEffect } from "react"
import { Bell, AlertTriangle, Search, Filter } from "lucide-react"
import { LoadingSpinner } from "@/components/dashboard/loading-spinner"
import { adminService } from "@/lib/services/admin"
import { toast } from "sonner"

const typeFilters = [
  { id: "all", label: "الكل" },
  { id: "critical", label: "حرجة" },
  { id: "warning", label: "تحذيرات" },
  { id: "info", label: "معلومات" },
  { id: "reminder", label: "تذكيرات" },
]

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    async function fetch() {
      try {
        const data = await adminService.getDefaulters()
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(
            data.map((item: unknown, i: number) => {
              const d = item as Record<string, unknown>
              return {
                id: String(d.id ?? i),
                title: String(d.title ?? "تطعيمات متأخرة جداً"),
                description: String(d.description ?? `${d.count ?? 127} طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم`),
                time: String(d.time ?? d.createdAt ?? "منذ ساعتين"),
                type: String(d.type ?? "warning"),
              }
            })
          )
        }
      } catch {
        toast.error("تعذر تحميل الإشعارات")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch = n.title.includes(searchQuery) || n.description.includes(searchQuery)
    const matchesFilter = activeFilter === "all" || n.type === activeFilter
    return matchesSearch && matchesFilter
  })

  if (loading) return <LoadingSpinner message="جارٍ تحميل الإشعارات..." />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">التنبيهات الهامة</h1>
        <p className="text-sm text-muted-foreground">عرض جميع الأنشطة والعمليات التي تمت في النظام</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث في الأنشطة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 ps-11 pe-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {typeFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            {f.label}
            {f.id === "all" && (
              <span className="ms-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs">
                {notifications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-bold text-foreground">التنبيهات الهامة</h2>
        </div>
        <div className="divide-y divide-border">
          {filteredNotifications.length === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-sm text-muted-foreground">{searchQuery ? "لا توجد نتائج مطابقة" : "لا توجد إشعارات حالياً"}</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f5f1]">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{notif.title}</h3>
                        <p className="text-sm text-muted-foreground">{notif.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{notif.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
