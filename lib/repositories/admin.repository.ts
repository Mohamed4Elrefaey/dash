import { adminService } from "@/lib/services/admin"

export const adminRepository = {
  getDashboardStats: () => adminService.getStats(),

  getAlerts: (limit = 6) => adminService.getDefaulters().then(data => data.slice(0, limit)),

  getForecast: () => adminService.getForecast(),

  getAgeDistribution: () => adminService.getChildrenByAge(),

  getVaccinationCoverage: () => adminService.getVaccinationCoverage(),

  triggerNotifications: () => adminService.triggerNotifications(),
}
