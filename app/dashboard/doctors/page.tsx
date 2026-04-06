"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Stethoscope, MapPin, Phone, Clock, Pencil, Trash2, Eye, X, CheckCircle } from "lucide-react"
import { doctorsRepository } from "@/lib/repositories/doctors.repository"
import { type Doctor, type CreateDoctorDto as DoctorPayload } from "@/lib/models/doctor.model"
import { LoadingSpinner } from "@/components/dashboard/loading-spinner"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { StatCard } from "@/components/dashboard/stat-card"
import { toast } from "sonner"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null)

  useEffect(() => {
    fetchDoctors()
  }, [])

  async function fetchDoctors() {
    try {
      setLoading(true)
      const data = await doctorsRepository.getDoctors()
      setDoctors(data)
    } catch {
      toast.error("تعذر تحميل بيانات الأطباء")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddDoctor(data: DoctorPayload) {
    setAddLoading(true)
    try {
      const payload = {
        ...data,
        longitude: data.longitude || 0,
        latitude: data.latitude || 0,
        price: Number(data.price) || 0,
        clinics: Array.isArray(data.clinics) ? data.clinics : [],
      }
      await doctorsRepository.createDoctor(payload)
      toast.success("تم إضافة الطبيب بنجاح")
      setIsAddModalOpen(false)
      fetchDoctors()
    } catch (err) {
      console.error("Add doctor error:", err)
      toast.error(err instanceof Error ? err.message : "تعذر إضافة الطبيب")
    } finally {
      setAddLoading(false)
    }
  }

  const filteredDoctors = doctors.filter((d) =>
    d.name?.includes(searchQuery) || d.specialty?.includes(searchQuery)
  )

  if (loading) return <LoadingSpinner message="جارٍ تحميل بيانات الأطباء..." />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">دليل الاطباء و العيادات</h1>
          <p className="text-sm text-muted-foreground">إدارة بيانات الأطباء والعيادات</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />إضافة طبيب جديد
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="إجمالي الأطباء" value={doctors.length.toString()} icon={Stethoscope} iconBgColor="bg-[#e8f5f1]" />
        <StatCard title="العيادات النشطة" value="---" icon={MapPin} iconBgColor="bg-[#e8f5f1]" />
        <StatCard title="أطباء قريبون" value="---" icon={Phone} iconBgColor="bg-[#e8f5f1]" />
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="ابحث باسم الطبيب أو التخصص" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-border bg-card py-2.5 ps-11 pe-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-bold text-foreground">جدول الأطباء ({filteredDoctors.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-start font-semibold text-foreground">الاسم</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">التخصص</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">العنوان</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">الهاتف</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">السعر</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">الاجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">{searchQuery ? "لا توجد نتائج" : "لا يوجد أطباء مسجلين"}</td></tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <Stethoscope className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground">{doctor.specialty}</td>
                    <td className="px-5 py-3 text-foreground">{doctor.address || "---"}</td>
                    <td className="px-5 py-3 text-foreground">{doctor.phone || "---"}</td>
                    <td className="px-5 py-3 text-foreground">{doctor.price ? `${doctor.price} ج.م` : "---"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewingDoctor(doctor)} className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"><Eye className="h-3.5 w-3.5" />عرض</button>
                        <button onClick={() => setDeleteTarget(doctor)} className="inline-flex items-center gap-1 rounded-lg border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors"><Trash2 className="h-3.5 w-3.5" />حذف</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Doctor Modal */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-xl">
            <div className="relative border-b border-border px-6 py-5 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"><Stethoscope className="h-7 w-7 text-primary" /></div>
              <h2 className="text-xl font-bold text-foreground">{viewingDoctor.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{viewingDoctor.specialty}</p>
              <button onClick={() => setViewingDoctor(null)} className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted" aria-label="إغلاق"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 px-6 py-5 text-sm">
              {viewingDoctor.bio && <p className="text-muted-foreground">{viewingDoctor.bio}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground">الهاتف:</span><p className="font-medium text-foreground">{viewingDoctor.phone || "---"}</p></div>
                <div><span className="text-muted-foreground">واتساب:</span><p className="font-medium text-foreground">{viewingDoctor.whatsappNumber || "---"}</p></div>
                <div><span className="text-muted-foreground">العنوان:</span><p className="font-medium text-foreground">{viewingDoctor.address || "---"}</p></div>
                <div><span className="text-muted-foreground">السعر:</span><p className="font-medium text-foreground">{viewingDoctor.price ? `${viewingDoctor.price} ج.م` : "---"}</p></div>
                <div><span className="text-muted-foreground">ساعات العمل:</span><p className="font-medium text-foreground">{viewingDoctor.workingHours || "---"}</p></div>
              </div>
              {viewingDoctor.clinics && viewingDoctor.clinics.length > 0 && (
                <div><span className="text-muted-foreground">العيادات:</span><div className="mt-1 flex flex-wrap gap-2">{viewingDoctor.clinics.map((c, i) => (<span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{c}</span>))}</div></div>
              )}
            </div>
            <div className="border-t border-border px-6 py-4 text-center">
              <button onClick={() => setViewingDoctor(null)} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      <AddDoctorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddDoctor} loading={addLoading} />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { setDoctors((prev) => prev.filter((d) => d.id !== deleteTarget?.id)); setDeleteTarget(null); toast.success("تم حذف الطبيب بنجاح") }}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف الطبيب "${deleteTarget?.name}"؟`}
        confirmLabel="نعم، احذف"
        variant="danger"
      />
    </div>
  )
}

function AddDoctorModal({ isOpen, onClose, onSubmit, loading }: { isOpen: boolean; onClose: () => void; onSubmit: (data: DoctorPayload) => void; loading: boolean }) {
  const [form, setForm] = useState<DoctorPayload>({ name: "", imageUrl: "", specialty: "", bio: "", whatsappNumber: "", clinics: [], workingHours: "", price: 0, address: "", phone: "", longitude: 0, latitude: 0 })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { if (isOpen) { setForm({ name: "", imageUrl: "", specialty: "", bio: "", whatsappNumber: "", clinics: [], workingHours: "", price: 0, address: "", phone: "", longitude: 0, latitude: 0 }); setErrors({}) } }, [isOpen])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "اسم الطبيب مطلوب"
    if (!form.specialty.trim()) errs.specialty = "التخصص مطلوب"
    if (!form.phone.trim()) errs.phone = "رقم الهاتف مطلوب"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  if (!isOpen) return null

  const inputClass = (field: string) => `w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${errors[field] ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive" : "border-border bg-card focus:border-primary focus:ring-primary"}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-xl">
        <div className="relative border-b border-border px-6 py-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"><Stethoscope className="h-7 w-7 text-primary" /></div>
          <h2 className="text-xl font-bold text-foreground">إضافة طبيب جديد</h2>
          <p className="mt-1 text-sm text-muted-foreground">قم بإدخال بيانات الطبيب لإضافته إلى النظام</p>
          <button onClick={onClose} className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted" aria-label="إغلاق"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">اسم الطبيب <span className="text-destructive">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass("name")} placeholder="ادخل اسم الطبيب" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">التخصص <span className="text-destructive">*</span></label>
            <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className={inputClass("specialty")} placeholder="ادخل التخصص" />
            {errors.specialty && <p className="mt-1 text-xs text-destructive">{errors.specialty}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">الهاتف <span className="text-destructive">*</span></label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass("phone")} placeholder="01xxxxxxxxx" />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">واتساب</label>
              <input type="tel" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className={inputClass("")} placeholder="01xxxxxxxxx" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">العنوان</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass("")} placeholder="ادخل العنوان" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">السعر</label>
              <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputClass("")} placeholder="٠" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">ساعات العمل</label>
              <input type="text" value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} className={inputClass("")} placeholder="9 ص - 5 م" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">نبذة</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="اكتب نبذة عن الطبيب" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 border-t border-border px-6 py-4">
          <button onClick={() => { if (validate()) onSubmit(form) }} disabled={loading} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <CheckCircle className="h-4 w-4" />}إضافة
          </button>
          <button onClick={onClose} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  )
}
