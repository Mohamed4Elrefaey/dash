import { apiClient } from "@/lib/api-client"
import { AdminStats, ChildrenByAge, ForecastData, VaccinationCoverage } from "@/lib/models/admin.model"

export const adminService = {
  getStats: () => apiClient<AdminStats>("/admin/stats"),

  getDefaulters: () => apiClient<any[]>("/admin/defaulters"),

  getForecast: () => apiClient<ForecastData[]>("/admin/forecast"),

  triggerNotifications: () =>
    apiClient<{ message: string }>("/admin/trigger-notifications", { method: "POST" }),

  getChildrenByAge: () => apiClient<ChildrenByAge[]>("/admin/children-by-age"),

  getVaccinationCoverage: () =>
    apiClient<VaccinationCoverage[]>("/admin/vaccination-coverage"),
}
