import { apiClient } from "@/lib/api-client"

export interface DoctorPayload {
  name: string
  imageUrl: string
  specialty: string
  bio: string
  whatsappNumber: string
  clinics: string[]
  workingHours: string
  price: number
  address: string
  phone: string
  longitude: number
  latitude: number
}

export const doctorsService = {
  getAll: () => apiClient<unknown[]>("/api/doctors"),
  create: (data: DoctorPayload) => apiClient<unknown>("/api/doctors", { method: "POST", body: data }),
  getNearby: () => apiClient<unknown[]>("/api/doctors/nearby"),
}
