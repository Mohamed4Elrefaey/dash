import { apiClient } from "@/lib/api-client"
import { Medicine, CreateMedicineDto } from "@/lib/models/medicine.model"
import { ApiResponse } from "@/lib/models/api.model"

export const medicinesService = {
  getAll: (page = 1, limit = 20) =>
    apiClient<ApiResponse<Medicine[]>>(`/medicines?page=${page}&limit=${limit}`),

  getById: (id: string | number) =>
    apiClient<Medicine>(`/medicines/${id}`),

  create: (data: CreateMedicineDto) =>
    apiClient<Medicine>("/medicines", { method: "POST", body: data }),

  update: (id: string | number, data: Partial<CreateMedicineDto>) =>
    apiClient<Medicine>(`/medicines/${id}`, { method: "PUT", body: data }),

  delete: (id: string | number) =>
    apiClient(`/medicines/${id}`, { method: "DELETE" }),
}
