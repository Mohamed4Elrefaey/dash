"use client"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  Users,
  Syringe,
  Bell,
  Download,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { StatCard } from "@/components/dashboard/stat-card"
import { toast } from "sonner"

const PIE_COLORS = ["#4db6ac", "#80cbc4", "#26a69a", "#b2dfdb", "#009688", "#00796b"]

// Static mock data
const mockForecast = [
  { month: "يناير", predicted: 4000, actual: 3800 },
  { month: "فبراير", predicted: 4500, actual: 4200 },
  { month: "مارس", predicted: 5000, actual: 4800 },
  { month: "أبريل", predicted: 5500, actual: 5400 },
  { month: "مايو", predicted: 6000, actual: 5800 },
  { month: "يونيو", predicted: 6500, actual: 6200 },
]

const mockChildrenByAge = [
  { ageGroup: "0-1 سنة", count: 5000, percentage: 37 },
  { ageGroup: "1-2 سنة", count: 3500, percentage: 26 },
  { ageGroup: "2-4 سنة", count: 3000, percentage: 22 },
  { ageGroup: "4-6 سنة", count: 2000, percentage: 15 },
]

const mockCoverage = [
  { vaccine: "شلل الأطفال", coverage: 95 },
  { vaccine: "الحصبة", coverage: 91 },
  { vaccine: "الدرن (BCG)", coverage: 94 },
  { vaccine: "الثلاثي البكتيري", coverage: 92 },
  { vaccine: "الروتا", coverage: 74 },
  { vaccine: "الالتهاب الكبدي B", coverage: 91 },
]

export default function ReportsPage() {
  const [notifLoading, setNotifLoading] = useState(false)

  async function handleTriggerNotifications() {
    setNotifLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast.success("تم إرسال التنبيهات بنجاح")
      setNotifLoading(false)
    }, 1000)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">التقارير و التحليلات</h1>
          <p className="text-sm text-muted-foreground">تحليلات شاملة لبيانات التطعيمات والأطفال</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerNotifications}
            disabled={notifLoading}
            className="flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            {notifLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            ارسال التنبيهات
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="إجمالي الأطفال" value="١٣,٥٠٠" icon={TrendingUp} iconBgColor="bg-[#e8f5f1]" />
        <StatCard title="فئات الأعمار" value="٤ فئات" icon={Users} iconBgColor="bg-[#e8f5f1]" />
        <StatCard title="اللقاحات المتابعة" value="١٤" icon={Syringe} iconBgColor="bg-[#e8f5f1]" />
        <StatCard title="التقارير المتاحة" value="٣" icon={BarChart3} iconBgColor="bg-[#e8f5f1]" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Forecast Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-bold text-foreground">التنبؤ بالتطعيمات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockForecast} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px", direction: "rtl" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="predicted" stroke="#4db6ac" strokeWidth={2} name="متوقع" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="actual" stroke="#80cbc4" strokeWidth={2} strokeDasharray="5 5" name="فعلي" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Children by Age */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-bold text-foreground">الأطفال حسب الفئة العمرية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockChildrenByAge}
                dataKey="count"
                nameKey="ageGroup"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ ageGroup, percentage }) => `${ageGroup || ""} ${percentage ? `(${percentage}%)` : ""}`}
                labelLine={{ stroke: "#6b7280" }}
              >
                {mockChildrenByAge.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px", direction: "rtl" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Vaccination Coverage */}
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-bold text-foreground">تغطية التطعيمات</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={mockCoverage} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <YAxis dataKey="vaccine" type="category" tick={{ fontSize: 12 }} width={75} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px", direction: "rtl" }}
                formatter={(value: number) => [`${value}%`, "نسبة التغطية"]}
              />
              <Bar dataKey="coverage" fill="#4db6ac" radius={[0, 4, 4, 0]} barSize={24} name="نسبة التغطية" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
