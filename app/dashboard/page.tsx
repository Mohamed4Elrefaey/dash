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
  MessageSquare,
  Pill,
} from "lucide-react"
import Link from "next/link"
import { StatCard } from "@/components/dashboard/stat-card"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { childrenRepository } from "@/lib/repositories/children.repository"
import { postsRepository } from "@/lib/repositories/posts.repository"
import { medicinesRepository } from "@/lib/repositories/medicines.repository"
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

import { type Medicine } from "@/lib/models/medicine.model"

import { adminRepository } from "@/lib/repositories/admin.repository"
import { type AdminStats } from "@/lib/models/admin.model"

export default function DashboardPage() {
  const [totalChildren, setTotalChildren] = useState<number | null>(null)
  const [totalPosts, setTotalPosts] = useState<number | null>(null)
  const [totalMedicines, setTotalMedicines] = useState<number | null>(null)
  const [latestMedicines, setLatestMedicines] = useState<Medicine[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [children, postsRes, medicines, adminStats] = await Promise.all([
          childrenRepository.getChildren(),
          postsRepository.getPostsWithMeta(1, 1),
          medicinesRepository.getMedicines(),
          adminRepository.getDashboardStats()
        ])
        setTotalChildren(children.length)
        setTotalPosts(postsRes.meta?.totalDocs || postsRes.data.length)
        setTotalMedicines(medicines.length)
        setLatestMedicines(medicines.slice(0, 4))
        setStats(adminStats)
      } catch (err) {
        console.error("Dashboard data fetch error:", err)
        toast.error("تعذر تحميل بيانات لوحة التحكم")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="إجمالي الأطفال المسجلين"
          value={
            loading
              ? "..."
              : totalChildren?.toLocaleString("ar-EG") ?? "---"
          }
          icon={Users}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="معدل الالتزام بالتطعيمات"
          value={loading ? "..." : stats?.complianceRate ? `${stats.complianceRate}%` : "٧٦%"}
          icon={CheckCircle}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="تطعيمات متاخرة"
          value={loading ? "..." : stats?.lateVaccinations?.toLocaleString("ar-EG") ?? "١,٢٥٠"}
          icon={AlertTriangle}
          trend={{ value: "٨.١%", positive: false }}
          iconBgColor="bg-destructive/10"
        />
        <StatCard
          title="إجمالي الأدوية"
          value={
            loading
              ? "..."
              : totalMedicines?.toLocaleString("ar-EG") ?? "---"
          }
          icon={Pill}
          trend={{ value: "٣.١%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="إجمالي المنشورات"
          value={
            loading
              ? "..."
              : totalPosts?.toLocaleString("ar-EG") ?? "---"
          }
          icon={MessageSquare}
          trend={{ value: "٥.٢%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="السجلات النشطة اليوم"
          value="٤٢"
          icon={FileText}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
      </div>

      {/* Chart */}
      <div className="mb-8">
        <DashboardChart isStatic={false} />
      </div>

      {/* Alerts & Activities */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AlertsSection />
        <ActivitiesSection />
      </div>

      {/* Latest Medicines */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">الأدوية المضافة حديثاً</h2>
          <Link href="/dashboard/content" className="text-sm text-primary hover:underline">عرض الكل</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latestMedicines.length === 0 ? (
            <div className="col-span-full flex h-32 items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
              <p className="text-sm text-muted-foreground">لا توجد أدوية مضافة حالياً</p>
            </div>
          ) : (
            latestMedicines.map((medicine) => (
              <div key={medicine.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground line-clamp-1">{medicine.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{medicine.category}</p>
                <div className="mt-4">
                  <Link href="/dashboard/content" className="inline-flex items-center text-xs font-medium text-primary hover:underline">
                    تفاصيل الدواء
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
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
