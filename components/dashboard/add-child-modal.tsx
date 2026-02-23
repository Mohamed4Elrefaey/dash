"use client"

import { useState, useEffect } from "react"
import { X, Baby, CheckCircle } from "lucide-react"

interface AddChildModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ChildFormData) => void
  loading?: boolean
}

export interface ChildFormData {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: "boy" | "girl"
  motherNationalId: string
  governorate: string
  city: string
  healthUnit: string
}

const governorates = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية", "الغربية", "كفر الشيخ", "البحيرة", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان"]

export function AddChildModal({ isOpen, onClose, onSubmit, loading = false }: AddChildModalProps) {
  const [form, setForm] = useState<ChildFormData>({
    name: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "boy",
    motherNationalId: "",
    governorate: "",
    city: "",
    healthUnit: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", nationalId: "", dateOfBirth: "", gender: "boy", motherNationalId: "", governorate: "", city: "", healthUnit: "" })
      setErrors({})
    }
  }, [isOpen])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "اسم الطفل مطلوب"
    if (!form.nationalId.trim()) errs.nationalId = "الرقم القومي مطلوب"
    else if (form.nationalId.length < 14) errs.nationalId = "الرقم القومي يجب أن يكون 14 رقم"
    if (!form.dateOfBirth) errs.dateOfBirth = "تاريخ الميلاد مطلوب"
    if (!form.motherNationalId.trim()) errs.motherNationalId = "الرقم القومي للأم مطلوب"
    if (!form.governorate) errs.governorate = "المحافظة مطلوبة"
    if (!form.city.trim()) errs.city = "المدينة مطلوبة"
    if (!form.healthUnit.trim()) errs.healthUnit = "الوحدة الصحية مطلوبة"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form)
    }
  }

  if (!isOpen) return null

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive"
        : "border-border bg-card focus:border-primary focus:ring-primary"
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-xl">
        <div className="relative border-b border-border px-6 py-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Baby className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">إضافة طفل جديد</h2>
          <p className="mt-1 text-sm text-muted-foreground">قم بإدخال بيانات الطفل لإضافته إلى النظام</p>
          <button onClick={onClose} className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="إغلاق">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">اسم الطفل <span className="text-destructive">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass("name")} placeholder="ادخل اسم الطفل" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">الرقم القومي <span className="text-destructive">*</span></label>
            <input type="text" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} className={inputClass("nationalId")} placeholder="ادخل الرقم القومي" maxLength={14} />
            {errors.nationalId && <p className="mt-1 text-xs text-destructive">{errors.nationalId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">تاريخ الميلاد <span className="text-destructive">*</span></label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className={inputClass("dateOfBirth")} />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-destructive">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">النوع <span className="text-destructive">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setForm({ ...form, gender: "boy" })} className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${form.gender === "boy" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`}>ذكر</button>
                <button type="button" onClick={() => setForm({ ...form, gender: "girl" })} className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${form.gender === "girl" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`}>أنثى</button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">الرقم القومي للأم <span className="text-destructive">*</span></label>
            <input type="text" value={form.motherNationalId} onChange={(e) => setForm({ ...form, motherNationalId: e.target.value })} className={inputClass("motherNationalId")} placeholder="ادخل الرقم القومي للأم" maxLength={14} />
            {errors.motherNationalId && <p className="mt-1 text-xs text-destructive">{errors.motherNationalId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">المحافظة <span className="text-destructive">*</span></label>
              <select value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })} className={inputClass("governorate")}>
                <option value="">اختر المحافظة</option>
                {governorates.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.governorate && <p className="mt-1 text-xs text-destructive">{errors.governorate}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">المدينة <span className="text-destructive">*</span></label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass("city")} placeholder="ادخل المدينة" />
              {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">الوحدة الصحية <span className="text-destructive">*</span></label>
            <input type="text" value={form.healthUnit} onChange={(e) => setForm({ ...form, healthUnit: e.target.value })} className={inputClass("healthUnit")} placeholder="ادخل الوحدة الصحية" />
            {errors.healthUnit && <p className="mt-1 text-xs text-destructive">{errors.healthUnit}</p>}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 border-t border-border px-6 py-4">
          <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <CheckCircle className="h-4 w-4" />}
            إضافة الطفل
          </button>
          <button onClick={onClose} disabled={loading} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  )
}
