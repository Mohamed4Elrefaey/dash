import { adminService } from "@/lib/services/admin"

export const adminRepository = {
  getDashboardStats: () =>
    adminService.getStats().catch(() => ({
      totalChildren: 13500,
      complianceRate: 76,
      lateVaccinations: 1250,
      activeRecordsToday: 42,
    })),

  getAlerts: (limit = 6) =>
    adminService
      .getDefaulters()
      .then((data) => data.slice(0, limit))
      .catch(() => []),

  getForecast: () => adminService.getForecast(),

  getAgeDistribution: () => adminService.getChildrenByAge(),

  getVaccinationCoverage: () => adminService.getVaccinationCoverage(),

  triggerNotifications: () => adminService.triggerNotifications(),
}
