import { apiClient } from "@/lib/api-client"
import { Child, CreateChildDto, VaccinationScheduleItem } from "@/lib/models/child.model"

export const childrenService = {
  getAll: () => apiClient<Child[]>("/children"),

  create: (data: CreateChildDto) =>
    apiClient<Child>("/children", { method: "POST", body: data }),

  getMyChildren: () => apiClient<Child[]>("/children/my-children"),

  getVaccinationSchedule: (id: string | number) =>
    apiClient<VaccinationScheduleItem[]>(`/children/${id}/vaccination-schedule`),
}
