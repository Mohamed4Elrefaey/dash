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

export interface Doctor {
  id: string | number
  name: string
  imageUrl?: string
  specialty: string
  bio?: string
  whatsappNumber?: string
  clinics?: string[]
  workingHours?: string
  price?: number
  address?: string
  phone?: string
  longitude?: number
  latitude?: number
  [key: string]: unknown
}

export const doctorsService = {
  getAll: () => apiClient<Doctor[]>("/api/doctors"),
  create: (data: DoctorPayload) => apiClient<Doctor>("/api/doctors", { method: "POST", body: data }),
  getNearby: () => apiClient<Doctor[]>("/api/doctors/nearby"),
}
