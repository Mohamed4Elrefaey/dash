import { vaccinesService } from "@/lib/services/vaccines"
import { CreateVaccineDto } from "@/lib/models/vaccine.model"

export const vaccinesRepository = {
  getVaccines: async () => {
    const vaccines = await vaccinesService.getAll()
    return vaccines.map(v => ({
      ...v,
      type: v.mandatory ? "إلزامي" : "اختياري",
      targetAge: v.ageInMonths === 0 ? "عند الولادة" : `${v.ageInMonths} شهر`,
      doses: v.doseInfo || "---",
      coveragePercent: v.coveragePercent ?? 0
    }))
  },

  createVaccine: (data: CreateVaccineDto) => vaccinesService.create(data),

  seedVaccines: () => vaccinesService.seed(),
}
