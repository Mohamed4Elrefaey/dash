"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, ChevronDown, Eye, Baby, AlertCircle } from "lucide-react"
import { childrenRepository } from "@/lib/repositories/children.repository"
import { adminRepository } from "@/lib/repositories/admin.repository"
import { type Child } from "@/lib/models/child.model"
import { type ChildrenByAge } from "@/lib/models/admin.model"
import { LoadingSpinner } from "@/components/dashboard/loading-spinner"
import { AddChildModal, type ChildFormData } from "@/components/dashboard/add-child-modal"
import { toast } from "sonner"

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [ageDistribution, setAgeDistribution] = useState<ChildrenByAge[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("الكل")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)

  useEffect(() => {
    fetchChildren()
    fetchAgeDistribution()
  }, [])

  async function fetchChildren() {
    try {
      setLoading(true)
      const data = await childrenRepository.getChildren()
      setChildren(data)
    } catch {
      setError("تعذر تحميل بيانات الأطفال")
    } finally {
      setLoading(false)
    }
  }

  async function fetchAgeDistribution() {
    try {
      const data = await adminRepository.getAgeDistribution()
      if (Array.isArray(data)) setAgeDistribution(data)
    } catch {
      // Silent fail
    }
  }

  async function handleAddChild(data: Child) {
    setAddLoading(true)
    try {
      await childrenRepository.createChild(data)
      toast.success("تم إضافة الطفل بنجاح")
      setIsAddModalOpen(false)
      fetchChildren()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر إضافة الطفل")
    } finally {
      setAddLoading(false)
    }
  }

  const filteredChildren = children.filter(
    (child) =>
      child.name?.includes(searchQuery) ||
      child.nationalId?.includes(searchQuery),
  )

  const defaultAgeGroups = [
    { label: "حديثي الولادة ( 0-1 شهر)", percent: 15 },
    { label: "رضع ( 1-12 شهر )", percent: 45 },
    { label: "أطفال صغار ( 1-3 سنة )", percent: 30 },
    { label: "أكبر من 3 سنوات", percent: 10 },
  ]

  const ageGroups = ageDistribution.length > 0
    ? ageDistribution.map((g) => ({ label: String(g.ageGroup ?? ""), percent: Number(g.percentage ?? g.count ?? 0) }))
    : defaultAgeGroups

  if (loading) return <LoadingSpinner message="جارٍ تحميل بيانات الأطفال..." />

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الاطفال</h1>
          <p className="text-sm text-muted-foreground">الجدول الرسمي للأطفال، والتقارير الشاملة</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          اضافة طفل جديد
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <div className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">إجمالي الأطفال</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{children.length.toLocaleString("ar-EG")} طفل</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">أطفال تحت الملاحظة</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">---</p>
          </div>
        </div>
      </div>

      {/* Age Distribution Card */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Baby className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">توزيع الفئات العمرية</span>
        </div>
        <div className="space-y-3">
          {ageGroups.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-10 text-sm font-medium text-muted-foreground">{item.percent}%</span>
              <div className="flex-1">
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
              <span className="w-44 text-end text-sm text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث الرقم القومي للطفل أو الأم"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 ps-11 pe-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter("الكل")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeFilter === "الكل" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}
          >
            الكل
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">
            المحافظة
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-muted" aria-label="تصفية">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-bold text-foreground">جدول الاطفال ({filteredChildren.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-start font-semibold text-foreground">اسم الطفل</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">الرقم القومي للطفل</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">تاريخ الميلاد</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">المحافظة</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">الاجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredChildren.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                    {searchQuery ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد أطفال مسجلين"}
                  </td>
                </tr>
              ) : (
                filteredChildren.map((child) => (
                  <tr key={child.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-foreground">{child.name}</td>
                    <td className="px-5 py-3 text-foreground">{child.nationalId}</td>
                    <td className="px-5 py-3 text-foreground">{child.dateOfBirth}</td>
                    <td className="px-5 py-3 text-foreground">{child.governorate}</td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/children/${child.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        عرض
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddChild}
        loading={addLoading}
      />
    </div>
  )
}
