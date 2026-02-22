"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Search, Filter, ChevronDown, Eye, Baby, UserRound, UserRoundCheck } from "lucide-react"
import { childrenService, type Child, type VaccinationScheduleItem } from "@/lib/services/children"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { LoadingSpinner } from "@/components/dashboard/loading-spinner"

const tabs = [
  { id: "vaccinations", label: "سجل التطعيمات" },
  { id: "growth", label: "سجل النمو" },
  { id: "actions", label: "سجل الإجراءات" },
]

export default function ChildDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [child, setChild] = useState<Child | null>(null)
  const [vaccinations, setVaccinations] = useState<VaccinationScheduleItem[]>([])
  const [activeTab, setActiveTab] = useState("vaccinations")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("كل التطعيمات")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [allChildren, schedule] = await Promise.allSettled([
          childrenService.getAll(),
          childrenService.getVaccinationSchedule(id),
        ])

        if (allChildren.status === "fulfilled" && Array.isArray(allChildren.value)) {
          const found = allChildren.value.find((c) => String(c.id) === String(id))
          if (found) setChild(found)
        }

        if (schedule.status === "fulfilled" && Array.isArray(schedule.value)) {
          setVaccinations(schedule.value)
        }
      } catch {
        setError("تعذر تحميل بيانات الطفل")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <LoadingSpinner message="جارٍ تحميل بيانات الطفل..." />

  if (error || !child) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground">{error || "لم يتم العثور على بيانات الطفل"}</p>
        <Link href="/dashboard/children" className="text-sm text-primary hover:underline">العودة لقائمة الأطفال</Link>
      </div>
    )
  }

  const filteredVaccinations = vaccinations.filter((v) => {
    const matchesSearch = v.vaccineName?.includes(searchQuery)
    const matchesFilter = activeFilter === "كل التطعيمات" || v.status === activeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/children" className="hover:text-primary">ادارة الأطفال</Link>
          <span>{">"}</span>
          <span className="font-medium text-foreground">ملف الطفل</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">عرض ملف الطفل الكامل بكل التفاصيل الخاصة به</p>
      </div>

      {/* Info Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Child Data */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Baby className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-foreground">بيانات الطفل</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">الاسم : </span><span className="font-medium text-foreground">{child.name}</span></p>
            <p><span className="text-muted-foreground">الرقم القومي : </span><span className="font-medium text-foreground">{child.nationalId}</span></p>
            <p><span className="text-muted-foreground">تاريخ الميلاد : </span><span className="font-medium text-foreground">{child.dateOfBirth}</span></p>
            <p><span className="text-muted-foreground">النوع : </span><span className="font-medium text-foreground">{child.gender === "boy" ? "ذكر" : child.gender === "girl" ? "أنثى" : (child.gender || "---")}</span></p>
            <p><span className="text-muted-foreground">المحافظة : </span><span className="font-medium text-foreground">{child.governorate}</span></p>
            <p><span className="text-muted-foreground">الوحدة الصحية : </span><span className="font-medium text-foreground">{child.healthUnit || "---"}</span></p>
          </div>
        </div>

        {/* Mother Data */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <UserRoundCheck className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-foreground">بيانات الام</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">الرقم القومي : </span><span className="font-medium text-foreground">{child.motherNationalId || "---"}</span></p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <UserRound className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-foreground">معلومات إضافية</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">المدينة : </span><span className="font-medium text-foreground">{child.city || "---"}</span></p>
            <p><span className="text-muted-foreground">العمر : </span><span className="font-medium text-foreground">{child.age || "---"}</span></p>
          </div>
        </div>
      </div>

      {/* Records Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">السجل الخاص به</h2>
        <p className="text-sm text-muted-foreground">السجل الخاص بالحالة الصحية للطفل</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "vaccinations" && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="ابحث ب اسم التطعيم" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-border bg-card py-2.5 ps-11 pe-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveFilter("كل التطعيمات")} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeFilter === "كل التطعيمات" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}>كل التطعيمات</button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">الحالة<ChevronDown className="h-3.5 w-3.5" /></button>
              <button className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-muted" aria-label="تصفية"><Filter className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-bold text-foreground">كل التطعيمات ({filteredVaccinations.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-start font-semibold text-foreground">اسم التطعيم</th>
                    <th className="px-5 py-3 text-start font-semibold text-foreground">تاريخ استحقاقه</th>
                    <th className="px-5 py-3 text-start font-semibold text-foreground">تاريخ أخذه الفعلي</th>
                    <th className="px-5 py-3 text-start font-semibold text-foreground">الحالة</th>
                    <th className="px-5 py-3 text-start font-semibold text-foreground">الاجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVaccinations.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">لا توجد تطعيمات مسجلة</td></tr>
                  ) : (
                    filteredVaccinations.map((vaccination) => (
                      <tr key={vaccination.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 text-foreground">{vaccination.vaccineName}</td>
                        <td className="px-5 py-3 text-foreground">{vaccination.dueDate}</td>
                        <td className="px-5 py-3 text-foreground">{vaccination.actualDate || "---"}</td>
                        <td className="px-5 py-3"><StatusBadge status={vaccination.status as "تم" | "متأخر" | "قادم"} /></td>
                        <td className="px-5 py-3">
                          <button className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors">
                            <Eye className="h-3.5 w-3.5" />عرض التطعيم
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "growth" && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
          <p className="text-muted-foreground">سجل النمو - قريباً</p>
        </div>
      )}

      {activeTab === "actions" && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
          <p className="text-muted-foreground">سجل الإجراءات - قريباً</p>
        </div>
      )}
    </div>
  )
}
