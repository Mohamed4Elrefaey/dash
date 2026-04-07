import { apiClient } from "@/lib/api-client"
import { Doctor, CreateDoctorDto } from "@/lib/models/doctor.model"
import { ApiResponse } from "@/lib/models/api.model"

export const doctorsService = {
  getAll: (page = 1, limit = 10, search = "") =>
    apiClient<ApiResponse<Doctor[]>>(`/doctors?page=${page}&limit=${limit}&search=${search}`),

  create: (data: CreateDoctorDto) =>
    apiClient<Doctor>("/doctors", { method: "POST", body: data }),

  getNearby: (lat: number, lng: number, dist = 10000) =>
    apiClient<Doctor[]>(`/doctors/nearby?lat=${lat}&lng=${lng}&dist=${dist}`),

  delete: (id: string | number) =>
    apiClient(`/doctors/${id}`, { method: "DELETE" }),
}
