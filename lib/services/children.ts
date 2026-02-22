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

export interface Child {
  id: string | number
  name: string
  nationalId: string
  dateOfBirth: string
  gender?: string
  motherNationalId?: string
  governorate: string
  city?: string
  healthUnit?: string
  age?: string
  [key: string]: unknown
}

export interface VaccinationScheduleItem {
  id: string | number
  vaccineName: string
  dueDate: string
  actualDate?: string
  status: string
  [key: string]: unknown
}

export const childrenService = {
  getAll: () => apiClient<Child[]>("/api/children"),
  create: (data: ChildPayload) => apiClient<Child>("/api/children", { method: "POST", body: data }),
  getMyChildren: () => apiClient<Child[]>("/api/children/my-children"),
  getVaccinationSchedule: (id: string | number) =>
    apiClient<VaccinationScheduleItem[]>(`/api/children/${id}/vaccination-schedule`),
}
