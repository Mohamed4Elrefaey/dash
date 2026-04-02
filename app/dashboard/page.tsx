"use client"

import { useState, useEffect } from "react"
import {
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  ArrowLeft,
  TriangleAlert,
  ClipboardList,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { adminRepository } from "@/lib/repositories/admin.repository"
import { AdminStats } from "@/lib/models/admin.model"
import { toast } from "sonner"

const STATIC_ACTIVITIES = [
  {
    id: "a1",
    category: "إدارة النظام",
    action: "إضافة عيادة جديدة",
    description: "تمت إضافة عيادة جديدة إلى دليل العيادات بنجاح.",
    time: "منذ ساعة",
  },
  {
    id: "a2",
    category: "إدارة النظام",
    action: "تحديث جدول التطعيمات",
    description: "تم تحديث جدول التطعيمات الرسمي لعام ٢٠٢٤.",
    time: "منذ ٣ ساعات",
  },
  {
    id: "a3",
    category: "إدارة النظام",
    action: "تسجيل طفل جديد",
    description: "تم تسجيل طفل جديد في قاعدة البيانات بنجاح.",
    time: "منذ ٥ ساعات",
  },
]

const STATIC_ALERTS = [
  {
    id: "al1",
    title: "تطعيمات متأخرة",
    description: "١٢٧ طفل لديهم تطعيمات متأخرة عن موعدها.",
    time: "منذ ساعتين",
  },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const data = await adminRepository.getDashboardStats()
        setStats(data)
      } catch {
        toast.error("تعذر تحميل إحصائيات لوحة التحكم")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">نظرة عامة</h1>
        <p className="text-sm text-muted-foreground">
          ملخص شامل لحالة صحة الأطفال والتطعيمات
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي الأطفال المسجلين"
          value={
            loading
              ? "..."
              : stats?.totalChildren?.toLocaleString("ar-EG") ?? "---"
          }
          icon={Users}
          trend={stats ? { value: "١٢.٥%", positive: true } : undefined}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="معدل الالتزام بالتطعيمات"
          value={loading ? "..." : stats ? `${stats.complianceRate}%` : "---"}
          icon={CheckCircle}
          trend={stats ? { value: "١٢.٥%", positive: true } : undefined}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="تطعيمات متاخرة"
          value={
            loading
              ? "..."
              : stats?.lateVaccinations?.toLocaleString("ar-EG") ?? "---"
          }
          icon={AlertTriangle}
          trend={stats ? { value: "٨.١%", positive: false } : undefined}
          iconBgColor="bg-destructive/10"
        />
        <StatCard
          title="السجلات النشطة اليوم"
          value={
            loading
              ? "..."
              : stats?.activeRecordsToday?.toLocaleString("ar-EG") ?? "---"
          }
          icon={FileText}
          trend={stats ? { value: "١٢.٥%", positive: true } : undefined}
          iconBgColor="bg-[#e8f5f1]"
        />
      </div>

      {/* Chart */}
      <div className="mb-8">
        <DashboardChart isStatic />
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
        {STATIC_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-xl border border-[#c8e6df] bg-[#e8f5f1] p-4"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{alert.title}</h3>
                <TriangleAlert className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {alert.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))}
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
        {STATIC_ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {activity.category}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
