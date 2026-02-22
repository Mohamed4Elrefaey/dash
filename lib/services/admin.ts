import { apiClient } from "@/lib/api-client"

export const adminService = {
  getStats: () => apiClient<unknown>("/api/admin/stats"),
  getDefaulters: () => apiClient<unknown[]>("/api/admin/defaulters"),
  getForecast: () => apiClient<unknown>("/api/admin/forecast"),
  triggerNotifications: () => apiClient<unknown>("/api/admin/trigger-notifications", { method: "POST" }),
  getChildrenByAge: () => apiClient<unknown>("/api/admin/children-by-age"),
  getVaccinationCoverage: () => apiClient<unknown>("/api/admin/vaccination-coverage"),
}
