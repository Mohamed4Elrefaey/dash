"use client"

import { useState, useEffect } from "react"
import { X, Syringe, CheckCircle } from "lucide-react"
import { type Vaccine, type CreateVaccineDto } from "@/lib/models/vaccine.model"

interface AddVaccinationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateVaccineDto) => void
  initialData?: Vaccine | null
}

export function AddVaccinationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddVaccinationModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [targetAge, setTargetAge] = useState("")
  const [ageUnit, setAgeUnit] = useState("شهور")
  const [classification, setClassification] = useState("")
  const [publishStatus, setPublishStatus] = useState<"إلزامي" | "اختياري">("إلزامي")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setTargetAge(initialData.targetAge)
      setPublishStatus(initialData.type)
      setDescription("")
      setClassification("")
      setAgeUnit("شهور")
    } else {
      setName("")
      setDescription("")
      setTargetAge("")
      setAgeUnit("شهور")
      setClassification("")
      setPublishStatus("إلزامي")
    }
    setErrors({})
  }, [initialData, isOpen])

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {}
    if (!name.trim()) newErrors.name = true
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name,
      description: description || "---",
      ageInMonths: Number(targetAge) || 0,
      doseInfo: "جرعة واحدة",
      mandatory: publishStatus === "إلزامي",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card shadow-xl">
        {/* Header */}
        <div className="relative border-b border-border px-6 py-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Syringe className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? "تعديل التطعيم" : "إضافة تطعيم جديد"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            قم بإدخال بيانات التطعيم لإضافته إلى النظام
          </p>
          <button
            onClick={onClose}
            className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-5">
          {/* Vaccination Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              اسم التطعيم <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors((prev) => ({ ...prev, name: false }))
              }}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                errors.name
                  ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive"
                  : "border-border bg-card focus:border-primary focus:ring-primary"
              }`}
              placeholder="أدخل اسم التطعيم"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">اسم التطعيم مطلوب</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              وصف مختصر <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="اكتب وصفاً مختصراً للتطعيم"
            />
          </div>

          {/* Target Age & Classification */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                العمر المستهدف <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={targetAge}
                onChange={(e) => setTargetAge(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="١٢"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                التصنيف <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <select
                  value={ageUnit}
                  onChange={(e) => setAgeUnit(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="شهور">شهور</option>
                  <option value="سنوات">سنوات</option>
                  <option value="عند الولادة">عند الولادة</option>
                </select>
              </div>
            </div>
          </div>

          {/* Publish Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              حالة النشر <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPublishStatus("إلزامي")}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  publishStatus === "إلزامي"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                إلزامي
              </button>
              <button
                type="button"
                onClick={() => setPublishStatus("اختياري")}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  publishStatus === "اختياري"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                اختياري
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 border-t border-border px-6 py-4">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="h-4 w-4" />
            {initialData ? "حفظ التعديلات" : "اضافة تطعيم جديد"}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            الغاء
          </button>
        </div>
      </div>
    </div>
  )
}
