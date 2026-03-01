export interface CreateDoctorDto {
  name: string
  imageUrl?: string
  specialty?: string
  bio: string
  whatsappNumber: string
  clinics: string[]
  workingHours?: string
  price: number
  address: string
  phone?: string
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
  addedByUserId?: number
}
