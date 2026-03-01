"use client"

import { useState } from "react"
import { useEffect } from "react"
import { Plus, Pencil, Trash2, Syringe, CheckCircle, AlertTriangle } from "lucide-react"
import { type Vaccine } from "@/lib/models/vaccine.model"
import { vaccinesRepository } from "@/lib/repositories/vaccines.repository"
import { adminRepository } from "@/lib/repositories/admin.repository"
import { LoadingSpinner } from "@/components/dashboard/loading-spinner"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { AddVaccinationModal } from "@/components/dashboard/add-vaccination-modal"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { toast } from "sonner"

export default function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVaccination, setEditingVaccination] = useState<Vaccine | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Vaccine | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [vData, sData] = await Promise.all([
        vaccinesRepository.getVaccines(),
        adminRepository.getDashboardStats()
      ])
      setVaccinations(vData)
      setStats(sData)
    } catch {
      toast.error("تعذر تحميل بيانات التطعيمات")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (data: any) => {
    setAddLoading(true)
    try {
      await vaccinesRepository.createVaccine(data)
      setIsModalOpen(false)
      toast.success("تم إضافة التطعيم بنجاح")
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "تعذر إضافة التطعيم")
    } finally {
      setAddLoading(false)
    }
  }

  const handleEdit = async (data: any) => {
    // Note: The provided Swagger doesn't have a PUT /vaccines/{id} endpoint,
    // so we'll just show a message or use POST if the backend supports it as upsert.
    toast.info("تحديث التطعيم غير متاح حالياً في النظام")
    setIsModalOpen(false)
  }

  const handleDelete = async () => {
    // Note: The provided Swagger doesn't have a DELETE /vaccines/{id} endpoint.
    toast.info("حذف التطعيم غير متاح حالياً في النظام")
    setDeleteTarget(null)
  }

  const openAddModal = () => {
    setEditingVaccination(null)
    setIsModalOpen(true)
  }

  const openEditModal = (vaccination: Vaccine) => {
    setEditingVaccination(vaccination)
    setIsModalOpen(true)
  }

  if (loading) return <LoadingSpinner message="جارٍ تحميل بيانات التطعيمات..." />

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة التطعيمات</h1>
          <p className="text-sm text-muted-foreground">
            الجدول الرسمي للتطعيمات، القواعد العمرية، والتقارير الشاملة
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          اضافة تطعيم جديد
        </button>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="إجمالي التطعيمات"
          value={vaccinations.length.toString()}
          icon={Syringe}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="معدل الالتزام العام"
          value={stats?.complianceRate ? `${stats.complianceRate}%` : "---"}
          icon={CheckCircle}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="تطعيمات متاخره"
          value={stats?.lateVaccinations?.toLocaleString("ar-EG") ?? "---"}
          icon={AlertTriangle}
          iconBgColor="bg-destructive/10"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-bold text-foreground">جدول التطعيمات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-start font-semibold text-foreground">اسم التطعيم</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">العمر المستهدف</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">الجرعات</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">نسبه التغطية</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">النوع</th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">الاجراء</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.map((vaccination) => (
                <tr
                  key={vaccination.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-foreground">{vaccination.name}</td>
                  <td className="px-5 py-3 text-foreground">{vaccination.targetAge}</td>
                  <td className="px-5 py-3 text-foreground">{vaccination.doses}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${vaccination.coveragePercent}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground">
                        {vaccination.coveragePercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={vaccination.type} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(vaccination)}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteTarget(vaccination)}
                        className="inline-flex items-center gap-1 rounded-lg border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AddVaccinationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingVaccination(null)
        }}
        onSubmit={editingVaccination ? handleEdit : handleAdd}
        initialData={editingVaccination}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="تاكيد الحذف"
        message={`هل أنت متأكد من حذف التطعيم "${deleteTarget?.name}" من الجدول ؟ سوف يتم حذف التطعيم من الجدول بشكل نهائي`}
        confirmLabel="نعم، احذف"
        cancelLabel="إلغاء"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
