import { apiClient } from "@/lib/api-client"
import { Vaccine, CreateVaccineDto } from "@/lib/models/vaccine.model"

export const vaccinesService = {
  getAll: () => apiClient<Vaccine[]>("/vaccines"),

  create: (data: CreateVaccineDto) =>
    apiClient<Vaccine>("/vaccines", { method: "POST", body: data }),

  seed: () => apiClient("/vaccines/seed", { method: "POST" }),
}
