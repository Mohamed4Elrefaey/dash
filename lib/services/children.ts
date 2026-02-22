import { apiClient } from "@/lib/api-client"

export interface ChildPayload {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: "girl" | "boy"
  motherNationalId: string
  governorate: string
  city: string
  healthUnit: string
}

export const childrenService = {
  getAll: () => apiClient<unknown[]>("/api/children"),
  create: (data: ChildPayload) => apiClient<unknown>("/api/children", { method: "POST", body: data }),
  getMyChildren: () => apiClient<unknown[]>("/api/children/my-children"),
  getVaccinationSchedule: (id: string) => apiClient<unknown[]>(`/api/children/${id}/vaccination-schedule`),
}
