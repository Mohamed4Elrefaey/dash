"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, ChevronDown, Eye, Baby, AlertCircle } from "lucide-react"
import { mockChildren } from "@/lib/mock-data"

export default function ChildrenPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("الكل")

  const filteredChildren = mockChildren.filter(
    (child) =>
      child.name.includes(searchQuery) ||
      child.nationalId.includes(searchQuery),
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الاطفال</h1>
          <p className="text-sm text-muted-foreground">
            الجدول الرسمي للأطفال، والتقارير الشاملة
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          اضافة طفل جديد
        </button>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total Children */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <div className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">إجمالي الأطفال</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {"↑ ١٦٠٠.٥ هذا الشهر"}
            </p>
          </div>
        </div>

        {/* Children Under Observation */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">أطفال تحت الملاحظة</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">٤,٣٢٠ طفل</p>
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
          {[
            { label: "حديثي الولادة ( 0-1 شهر)", percent: 15 },
            { label: "رضع ( 1-12 شهر )", percent: 45 },
            { label: "أطفال صغار ( 1-3 سنة )", percent: 30 },
            { label: "أكبر من 3 سنوات", percent: 10 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-10 text-sm font-medium text-muted-foreground">
                {item.percent}%
              </span>
              <div className="flex-1">
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
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
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === "الكل"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            الكل
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">
            المحافظة
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">
            التاريخ
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
          <h2 className="font-bold text-foreground">جدول الاطفال</h2>
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
              {filteredChildren.map((child, index) => (
                <tr key={`${child.id}-${index}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-foreground">{child.name}</td>
                  <td className="px-5 py-3 text-foreground">{child.nationalId}</td>
                  <td className="px-5 py-3 text-foreground">{child.birthDate}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
