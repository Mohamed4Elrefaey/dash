export interface CreateChildDto {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: "boy" | "girl"
  motherNationalId: string
  governorate?: string
  city?: string
  healthUnit?: string
}

export interface Child {
  id: string | number
  name: string
  nationalId: string
  dateOfBirth: string
  gender?: string
  motherNationalId?: string
  parentUser?: {
    id: number
    name: string
  }
  registeredAt?: {
    governorate: string
    city: string
    healthUnit: string
  }
  governorate?: string // Flattend for UI convenience
  createdBy?: string
  createdByUserId?: number
}

export interface VaccinationScheduleItem {
  id: string | number
  vaccineName: string
  dueDate: string
  actualDate?: string
  status: string
  [key: string]: unknown
}
