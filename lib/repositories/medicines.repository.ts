import { medicinesService } from "@/lib/services/medicines"
import { CreateMedicineDto } from "@/lib/models/medicine.model"

export const medicinesRepository = {
  getMedicines: async (page?: number, limit?: number) => {
    const response = await medicinesService.getAll(page, limit)
    return response.data
  },

  getMedicinesWithMeta: (page?: number, limit?: number) => medicinesService.getAll(page, limit),

  getMedicineById: (id: string | number) => medicinesService.getById(id),

  createMedicine: (data: CreateMedicineDto) => medicinesService.create(data),

  updateMedicine: (id: string | number, data: Partial<CreateMedicineDto>) =>
    medicinesService.update(id, data),

  deleteMedicine: (id: string | number) => medicinesService.delete(id),
}
