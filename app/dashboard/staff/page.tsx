"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Plus,
  Search,
  Users,
  Shield,
  Mail,
  Phone,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  UserCircle,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { toast } from "sonner"

interface StaffMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: "نشط" | "غير نشط"
  joinDate: string
}

const mockStaff: StaffMember[] = [
  {
    id: "s1",
    name: "أحمد كمال",
    role: "مدير نظام",
    email: "ahmed.kamal@khatwa.com",
    phone: "01012345678",
    status: "نشط",
    joinDate: "٢٠٢٤/٠١/١٥",
  },
  {
    id: "s2",
    name: "سارة محمود",
    role: "محرر محتوى",
    email: "sara.m@khatwa.com",
    phone: "01112345678",
    status: "نشط",
    joinDate: "٢٠٢٤/٠٢/٠١",
  },
  {
    id: "s3",
    name: "محمود حسن",
    role: "مشرف عيادات",
    email: "m.hassan@khatwa.com",
    phone: "01212345678",
    status: "غير نشط",
    joinDate: "٢٠٢٣/١١/٢٠",
  },
]

export default function StaffPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "مدير نظام",
    phone: "",
  })

  useEffect(() => {
    const savedStaff = localStorage.getItem("khatwa_employees")
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff))
    } else {
      setStaff(mockStaff)
    }
  }, [])

  useEffect(() => {
    if (staff.length > 0 || localStorage.getItem("khatwa_employees")) {
      localStorage.setItem("khatwa_employees", JSON.stringify(staff))
    }
  }, [staff])

  useEffect(() => {
    if (!isLoading && user && !["admin", "super_admin"].includes(user.role)) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading || (user && !["admin", "super_admin"].includes(user.role))) {
    return null
  }

  const filteredStaff = staff.filter(
    (s) => s.name.includes(searchQuery) || s.email.includes(searchQuery),
  )

  const handleDelete = () => {
    if (!deleteTarget) return
    const updated = staff.filter((s) => s.id !== deleteTarget.id)
    setStaff(updated)
    setDeleteTarget(null)
    toast.success("تم حذف الموظف بنجاح")
  }

  const handleAddMember = () => {
    if (!formData.name || !formData.email) {
      toast.error("يرجى ملء البيانات المطلوبة")
      return
    }

    const newMember: StaffMember = {
      id: `s${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone || "غير متوفر",
      status: "نشط",
      joinDate: new Date().toLocaleDateString("ar-EG"),
    }

    setStaff((prev) => [newMember, ...prev])
    setIsAddModalOpen(false)
    setFormData({ name: "", email: "", role: "مدير نظام", phone: "" })
    toast.success("تم إضافة الموظف بنجاح")
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ادارة الموظفين</h1>
          <p className="text-sm text-muted-foreground">
            إدارة صلاحيات الموظفين والوصول للنظام
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          إضافة موظف جديد
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="إجمالي الموظفين"
          value={staff.length.toString()}
          icon={Users}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="نشطون حالياً"
          value={staff.filter((s) => s.status === "نشط").length.toString()}
          icon={CheckCircle}
          iconBgColor="bg-[#e8f5f1]"
        />
        <StatCard
          title="غير نشط"
          value={staff.filter((s) => s.status === "غير نشط").length.toString()}
          icon={X}
          iconBgColor="bg-destructive/10"
        />
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث باسم الموظف أو البريد الإلكتروني"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 ps-11 pe-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-bold text-foreground">
            قائمة الموظفين ({filteredStaff.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-start font-semibold text-foreground">
                  الموظف
                </th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">
                  الدور / الصلاحية
                </th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">
                  بيانات التواصل
                </th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">
                  الحالة
                </th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">
                  تاريخ الانضمام
                </th>
                <th className="px-5 py-3 text-start font-semibold text-foreground">
                  الاجراء
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    لا توجد نتائج مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground">{member.role}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          member.status === "نشط"
                            ? "bg-[#e8f5f1] text-[#2d7a6b]"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {member.joinDate}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(member)}
                          className="rounded-lg border border-destructive p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card shadow-xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                إضافة موظف جديد
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  اسم الموظف <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="ادخل الاسم الكامل"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  البريد الإلكتروني <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="example@khatwa.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                  placeholder="01xxxxxxxxx"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  الصلاحية
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={inputClass}
                >
                  <option value="مدير نظام">مدير نظام</option>
                  <option value="محرر محتوى">محرر محتوى</option>
                  <option value="مشرف عيادات">مشرف عيادات</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddMember}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                حفظ الموظف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="تأكيد حذف موظف"
        message={`هل أنت متأكد من سحب صلاحيات الموظف "${deleteTarget?.name}" وحذفه من النظام؟`}
        confirmLabel="نعم، احذف"
        variant="danger"
      />
    </div>
  )
}
