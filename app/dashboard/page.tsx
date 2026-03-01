"use client"

import { useState, useEffect } from "react"
import { Users, AlertTriangle, CheckCircle, FileText, ArrowLeft, TriangleAlert, ClipboardList } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { LoadingSpinner } from "@/components/dashboard/loading-spinner"
import { adminRepository } from "@/lib/repositories/admin.repository"
import { type AdminStats } from "@/lib/models/admin.model"

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await adminRepository.getDashboardStats()
        setStats(data)
      } catch {
        setError("تعذر تحميل البيانات")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <LoadingSpinner message="جارٍ تحميل لوحة المعلومات..." />

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">نظرة عامة</h1>
        <p className="text-sm text-muted-foreground">
          ملخص شامل لحالة صحة الأطفال والتطعيمات
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/5 p-3">
          <p className="text-sm text-warning">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي الأطفال المسجلين"
          value={stats?.totalChildren?.toLocaleString("ar-EG") ?? "---"}
          icon={Users}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="معدل الالتزام بالتطعيمات"
          value={stats?.complianceRate ? `${stats.complianceRate}%` : "---"}
          icon={CheckCircle}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="تطعيمات متاخرة"
          value={stats?.lateVaccinations?.toLocaleString("ar-EG") ?? "---"}
          icon={AlertTriangle}
          trend={{ value: "٨.١%", positive: false }}
          iconBgColor="bg-destructive/10"
        />
        <StatCard
          title="السجلات النشطة اليوم"
          value={stats?.activeRecordsToday?.toLocaleString("ar-EG") ?? "---"}
          icon={FileText}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
      </div>

      {/* Chart */}
      <div className="mb-8">
        <DashboardChart />
      </div>

      {/* Alerts & Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AlertsSection />
        <ActivitiesSection />
      </div>
    </div>
  )
}

function AlertsSection() {
  const [alerts, setAlerts] = useState<Array<{ id: string; title: string; description: string; time: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await adminRepository.getAlerts(6)
        if (Array.isArray(data) && data.length > 0) {
          setAlerts(data.map((item: { id?: string | number; title?: string; description?: string; time?: string; createdAt?: string }, i: number) => {
            return {
              id: String(item.id ?? i),
              title: String(item.title ?? "تطعيمات متأخرة جداً"),
              description: String(item.description ?? "يوجد أطفال لديهم تطعيمات متأخرة"),
              time: String(item.time ?? item.createdAt ?? "منذ ساعتين"),
            }
          }))
        }
      } catch {
        // Silently handle - show empty state
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">التنبيهات الهامة</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-muted/30 p-4">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">التنبيهات الهامة</h2>
        <button className="flex items-center gap-1 text-sm text-primary hover:underline">
          عرض الكل
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-card">
            <p className="text-sm text-muted-foreground">لا توجد تنبيهات حالياً</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-xl border border-[#c8e6df] bg-[#e8f5f1] p-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{alert.title}</h3>
                  <TriangleAlert className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ActivitiesSection() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">اخر الانشطة</h2>
        <button className="flex items-center gap-1 text-sm text-primary hover:underline">
          عرض الكل
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        {[
          {
            id: "a1",
            category: "إدارة النظام",
            action: "إضافة عيادة جديدة",
            description: "تمت إضافة عيادة باسم «عيادة الشفاء» إلى دليل العيادات بنجاح.",
            time: "١ م",
          },
          {
            id: "a2",
            category: "إدارة النظام",
            action: "إضافة طفل جديد",
            description: "تمت إضافة طفل جديد باسم «محمد أحمد على» إلى قاعدة بيانات النظام بنجاح.",
            time: "١٠ م",
          },
          {
            id: "a3",
            category: "فريق المحتوى",
            action: "إضافة مقال جديد",
            description: "تم نشر مقال جديد بعنوان «نصائح بسيطة لنوم الطفل الهادئ» ضمن قسم التوعية.",
            time: "١٠ م",
          },
        ].map((activity) => (
          <div key={activity.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{activity.category}</h3>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
