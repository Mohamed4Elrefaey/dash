"use client"

import { Users, AlertTriangle, CheckCircle, FileText, ArrowLeft, TriangleAlert, ClipboardList } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { mockActivities, mockAlerts } from "@/lib/mock-data"

export default function DashboardPage() {
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
          value="٢٤٥,٨٩٢"
          icon={Users}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="معدل الالتزام بالتطعيمات"
          value="٩٤.٧%"
          icon={CheckCircle}
          trend={{ value: "١٢.٥%", positive: true }}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="تطعيمات متاخرة"
          value="١٢,٤٥٦"
          icon={AlertTriangle}
          trend={{ value: "٨.١%", positive: false }}
          iconBgColor="bg-destructive/10"
        />
        <StatCard
          title="السجلات النشطة اليوم"
          value="١,٤٥٦"
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
        {/* Important Alerts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">التنبيهات الهامة</h2>
            <button className="flex items-center gap-1 text-sm text-primary hover:underline">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
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
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">اخر الانشطة</h2>
            <button className="flex items-center gap-1 text-sm text-primary hover:underline">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {mockActivities.map((activity) => (
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
      </div>
    </div>
  )
}
