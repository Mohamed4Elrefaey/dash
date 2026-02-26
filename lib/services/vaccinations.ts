import { mockVaccinations, type Vaccination } from "@/lib/mock-data"

let vaccinations: Vaccination[] = [...mockVaccinations]

export const vaccinationsService = {
  getAll: () => Promise.resolve(vaccinations),
  create: (data: Omit<Vaccination, "id">) => {
    const newVaccination: Vaccination = {
      ...data,
      id: `v${Date.now()}`,
    }
    vaccinations = [...vaccinations, newVaccination]
    return Promise.resolve(newVaccination)
  },
  update: (id: string, data: Omit<Vaccination, "id">) => {
    vaccinations = vaccinations.map((v) => (v.id === id ? { ...v, ...data } : v))
    return Promise.resolve(vaccinations.find((v) => v.id === id)!)
  },
  delete: (id: string) => {
    vaccinations = vaccinations.filter((v) => v.id !== id)
    return Promise.resolve({ success: true })
  },
}
