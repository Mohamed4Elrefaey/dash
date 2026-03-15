import { doctorsService } from "@/lib/services/doctors"
import { CreateDoctorDto } from "@/lib/models/doctor.model"

export const doctorsRepository = {
  getDoctors: async (page?: number, limit?: number, search?: string) => {
    const response = await doctorsService.getAll(page, limit, search)
    return response.data
  },

  createDoctor: (data: CreateDoctorDto) => doctorsService.create(data),

  getNearbyDoctors: (lat: number, lng: number, dist?: number) =>
    doctorsService.getNearby(lat, lng, dist),

  deleteDoctor: (id: string | number) => doctorsService.delete(id),
}
