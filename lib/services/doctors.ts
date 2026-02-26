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

let mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "د. أحمد مصطفى",
    specialty: "أخصائي طب الأطفال",
    address: "مصر الجديدة، القاهرة",
    phone: "01012345678",
    price: 300,
    bio: "أخصائي طب الأطفال وحديثي الولادة بمستشفى القصر العيني",
    workingHours: "4 م - 10 م",
    clinics: ["عيادة الشفاء", "مستشفى الأمل"],
    whatsappNumber: "01012345678"
  },
  {
    id: 2,
    name: "د. مريم على",
    specialty: "استشاري طب الأطفال",
    address: "الدقي، الجيزة",
    phone: "01112345678",
    price: 500,
    bio: "استشاري طب الأطفال والتغذية العلاجية",
    workingHours: "10 ص - 4 م",
    clinics: ["عيادة النخبة"],
    whatsappNumber: "01112345678"
  }
]

export const doctorsService = {
  getAll: () => Promise.resolve(mockDoctors),
  create: (data: DoctorPayload) => {
    const newDoctor: Doctor = { ...data, id: Math.random().toString(36).substr(2, 9) }
    mockDoctors = [newDoctor, ...mockDoctors]
    return Promise.resolve(newDoctor)
  },
  getNearby: () => Promise.resolve(mockDoctors),
  delete: (id: string | number) => {
    mockDoctors = mockDoctors.filter(d => d.id !== id)
    return Promise.resolve({ success: true })
  }
}
