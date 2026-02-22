"use client"

import { useState } from "react"
import {
  User,
  Settings,
  Bell,
  Save,
  Lock,
  Mail,
  Phone,
  Globe,
  Shield,
  Database,
  Monitor,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const tabs = [
  { id: "profile", label: "الملف الشخصي", icon: User },
  { id: "system", label: "إعدادات النظام", icon: Settings },
  { id: "notifications", label: "الإشعارات", icon: Bell },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">اعدادات النظام</h1>
        <p className="text-sm text-muted-foreground">إدارة إعدادات الحساب والنظام والإشعارات</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === "profile" && <ProfileSettings />}
      {activeTab === "system" && <SystemSettings />}
      {activeTab === "notifications" && <NotificationSettings />}
    </div>
  )
}

function ProfileSettings() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    role: user?.role || "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [saving, setSaving] = useState(false)

  function handleSaveProfile() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("تم حفظ بيانات الملف الشخصي بنجاح")
    }, 800)
  }

  function handleChangePassword() {
    if (!passwordForm.currentPassword) {
      toast.error("يرجى إدخال كلمة المرور الحالية")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة")
      return
    }
    toast.success("تم تغيير كلمة المرور بنجاح")
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const inputClass = "w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">البيانات الشخصية</h2>
            <p className="text-sm text-muted-foreground">تعديل بيانات حسابك الشخصي</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputClass} ps-11`} placeholder="ادخل الاسم الكامل" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputClass} ps-11`} placeholder="ادخل البريد الإلكتروني" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">رقم الهاتف</label>
            <div className="relative">
              <Phone className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${inputClass} ps-11`} placeholder="ادخل رقم الهاتف" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">الصلاحية</label>
            <div className="relative">
              <Shield className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={form.role} disabled className={`${inputClass} ps-11 bg-muted cursor-not-allowed`} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <Save className="h-4 w-4" />}
            حفظ التعديلات
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <Lock className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">تغيير كلمة المرور</h2>
            <p className="text-sm text-muted-foreground">تحديث كلمة المرور الخاصة بحسابك</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">كلمة المرور الحالية</label>
            <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className={inputClass} placeholder="ادخل كلمة المرور الحالية" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">كلمة المرور الجديدة</label>
            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className={inputClass} placeholder="ادخل كلمة المرور الجديدة" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">تأكيد كلمة المرور</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className={inputClass} placeholder="أعد إدخال كلمة المرور" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <button onClick={handleChangePassword} className="flex items-center gap-2 rounded-xl border border-destructive px-6 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors">
            <Lock className="h-4 w-4" />
            تغيير كلمة المرور
          </button>
        </div>
      </div>
    </div>
  )
}

function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: "خطوة",
    language: "ar",
    timezone: "Africa/Cairo",
    autoBackup: true,
    maintenanceMode: false,
    dataRetention: "365",
  })
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("تم حفظ إعدادات النظام بنجاح")
    }, 800)
  }

  const inputClass = "w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">الإعدادات العامة</h2>
            <p className="text-sm text-muted-foreground">إعدادات النظام الأساسية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">اسم النظام</label>
            <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">اللغة</label>
            <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className={inputClass}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">المنطقة الزمنية</label>
            <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className={inputClass}>
              <option value="Africa/Cairo">القاهرة (GMT+2)</option>
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">فترة الاحتفاظ بالبيانات (أيام)</label>
            <input type="number" value={settings.dataRetention} onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* System Toggles */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">إعدادات متقدمة</h2>
            <p className="text-sm text-muted-foreground">إعدادات النسخ الاحتياطي والصيانة</p>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleSetting
            label="النسخ الاحتياطي التلقائي"
            description="إنشاء نسخة احتياطية يومية تلقائياً"
            icon={Database}
            checked={settings.autoBackup}
            onChange={(val) => setSettings({ ...settings, autoBackup: val })}
          />
          <ToggleSetting
            label="وضع الصيانة"
            description="تعطيل الوصول للنظام مؤقتاً أثناء الصيانة"
            icon={Monitor}
            checked={settings.maintenanceMode}
            onChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
          {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <Save className="h-4 w-4" />}
          حفظ الإعدادات
        </button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lateVaccinationAlerts: true,
    newChildAlerts: true,
    systemAlerts: true,
    weeklyReport: true,
    monthlyReport: false,
  })
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("تم حفظ إعدادات الإشعارات بنجاح")
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Channels */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">قنوات الإشعارات</h2>
            <p className="text-sm text-muted-foreground">اختر طريقة تلقي الإشعارات</p>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleSetting label="إشعارات البريد الإلكتروني" description="تلقي الإشعارات عبر البريد الإلكتروني" icon={Mail} checked={settings.emailNotifications} onChange={(val) => setSettings({ ...settings, emailNotifications: val })} />
          <ToggleSetting label="إشعارات الرسائل النصية" description="تلقي الإشعارات عبر الرسائل النصية SMS" icon={Phone} checked={settings.smsNotifications} onChange={(val) => setSettings({ ...settings, smsNotifications: val })} />
        </div>
      </div>

      {/* Alert Types */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fef3c7]">
            <Bell className="h-5 w-5 text-[#92400e]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">أنواع التنبيهات</h2>
            <p className="text-sm text-muted-foreground">تخصيص أنواع التنبيهات التي تريد تلقيها</p>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleSetting label="تنبيهات التطعيمات المتأخرة" description="إشعار عند وجود تطعيمات متأخرة" icon={Bell} checked={settings.lateVaccinationAlerts} onChange={(val) => setSettings({ ...settings, lateVaccinationAlerts: val })} />
          <ToggleSetting label="تنبيهات إضافة أطفال جدد" description="إشعار عند تسجيل طفل جديد في النظام" icon={Bell} checked={settings.newChildAlerts} onChange={(val) => setSettings({ ...settings, newChildAlerts: val })} />
          <ToggleSetting label="تنبيهات النظام" description="إشعارات تحديثات وصيانة النظام" icon={Bell} checked={settings.systemAlerts} onChange={(val) => setSettings({ ...settings, systemAlerts: val })} />
        </div>
      </div>

      {/* Reports */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">التقارير الدورية</h2>
            <p className="text-sm text-muted-foreground">إعداد التقارير الدورية التلقائية</p>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleSetting label="تقرير أسبوعي" description="إرسال تقرير ملخص أسبوعي عبر البريد" icon={Bell} checked={settings.weeklyReport} onChange={(val) => setSettings({ ...settings, weeklyReport: val })} />
          <ToggleSetting label="تقرير شهري" description="إرسال تقرير تفصيلي شهري عبر البريد" icon={Bell} checked={settings.monthlyReport} onChange={(val) => setSettings({ ...settings, monthlyReport: val })} />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
          {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <Save className="h-4 w-4" />}
          حفظ الإعدادات
        </button>
      </div>
    </div>
  )
}

function ToggleSetting({ label, description, icon: Icon, checked, onChange }: { label: string; description: string; icon: React.ElementType; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${checked ? "start-0.5" : "start-[22px]"}`} />
      </button>
    </div>
  )
}
