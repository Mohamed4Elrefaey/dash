import { apiClient } from "@/lib/api-client"

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

export const adminService = {
  getStats: () => apiClient<AdminStats>("/api/admin/stats"),
  getDefaulters: () => apiClient<unknown[]>("/api/admin/defaulters"),
  getForecast: () => apiClient<ForecastData[]>("/api/admin/forecast"),
  triggerNotifications: () => apiClient<{ message: string }>("/api/admin/trigger-notifications", { method: "POST" }),
  getChildrenByAge: () => apiClient<ChildrenByAge[]>("/api/admin/children-by-age"),
  getVaccinationCoverage: () => apiClient<VaccinationCoverage[]>("/api/admin/vaccination-coverage"),
}
