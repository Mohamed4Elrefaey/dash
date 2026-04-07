import { apiClient } from "@/lib/api-client"
import { Vaccine, CreateVaccineDto } from "@/lib/models/vaccine.model"

export const vaccinesService = {
  getAll: () => apiClient<Vaccine[]>("/vaccines"),

  create: (data: CreateVaccineDto) =>
    apiClient<Vaccine>("/vaccines", { method: "POST", body: data }),

  update: (id: string | number, data: Partial<CreateVaccineDto>) =>
    apiClient<Vaccine>(`/vaccines/${id}`, { method: "PUT", body: data }),

  delete: (id: string | number) =>
    apiClient(`/vaccines/${id}`, { method: "DELETE" }),

  seed: () => apiClient("/vaccines/seed", { method: "POST" }),
}
