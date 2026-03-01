import { childrenService } from "@/lib/services/children"
import { CreateChildDto } from "@/lib/models/child.model"

export const childrenRepository = {
  getChildren: async () => {
    const children = await childrenService.getAll()
    // Map registeredAt to governorate for UI if needed
    return children.map(child => ({
      ...child,
      governorate: child.governorate || child.registeredAt?.governorate || "---"
    }))
  },

  createChild: (data: CreateChildDto) => childrenService.create(data),

  getMyChildren: () => childrenService.getMyChildren(),

  getVaccinationSchedule: (id: string | number) =>
    childrenService.getVaccinationSchedule(id),
}
