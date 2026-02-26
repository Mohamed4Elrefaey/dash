import { monthlyVaccinationData } from "@/lib/mock-data"

export interface AdminStats {
  totalChildren?: number
  totalVaccinations?: number
  complianceRate?: number
  lateVaccinations?: number
  activeRecordsToday?: number
  [key: string]: unknown
}

export interface ForecastData {
  month?: string
  predicted?: number
  actual?: number
  [key: string]: unknown
}

export interface ChildrenByAge {
  ageGroup?: string
  count?: number
  percentage?: number
  [key: string]: unknown
}

export interface VaccinationCoverage {
  vaccine?: string
  coverage?: number
  [key: string]: unknown
}

const mockStats: AdminStats = {
  totalChildren: 12500,
  totalVaccinations: 45000,
  complianceRate: 94,
  lateVaccinations: 3247,
  activeRecordsToday: 156,
}

const mockDefaulters = [
  { id: "1", title: "تطعيمات متأخرة جداً", description: "١٢٧ طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم", time: "منذ ساعتين" },
  { id: "2", title: "تطعيمات متأخرة جداً", description: "١٢٧ طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم", time: "منذ ساعتين" },
  { id: "3", title: "تطعيمات متأخرة جداً", description: "١٢٧ طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم", time: "منذ ساعتين" },
]

const mockForecast: ForecastData[] = monthlyVaccinationData.map(d => ({
  month: d.month,
  predicted: d.count + Math.floor(Math.random() * 500),
  actual: d.count
}))

const mockChildrenByAge: ChildrenByAge[] = [
  { ageGroup: "حديثي الولادة ( 0-1 شهر)", count: 1875, percentage: 15 },
  { ageGroup: "رضع ( 1-12 شهر )", count: 5625, percentage: 45 },
  { ageGroup: "أطفال صغار ( 1-3 سنة )", count: 3750, percentage: 30 },
  { ageGroup: "أكبر من 3 سنوات", count: 1250, percentage: 10 },
]

const mockCoverage: VaccinationCoverage[] = [
  { vaccine: "شلل الأطفال", coverage: 95 },
  { vaccine: "الحصبة", coverage: 91 },
  { vaccine: "الدرن (BCG)", coverage: 95 },
  { vaccine: "الثلاثي البكتيري", coverage: 94 },
  { vaccine: "الخماسي البكتيري", coverage: 92 },
]

export const adminService = {
  getStats: () => Promise.resolve(mockStats),
  getDefaulters: () => Promise.resolve(mockDefaulters),
  getForecast: () => Promise.resolve(mockForecast),
  triggerNotifications: () => Promise.resolve({ message: "تم إرسال التنبيهات بنجاح لجميع أولياء الأمور" }),
  getChildrenByAge: () => Promise.resolve(mockChildrenByAge),
  getVaccinationCoverage: () => Promise.resolve(mockCoverage),
}
