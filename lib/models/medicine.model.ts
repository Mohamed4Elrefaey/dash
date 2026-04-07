export interface CreateMedicineDto {
  name: string
  description: string
  category: string
  form: string
  usage: string
  details?: string
  sideEffects: string
  imageUrl?: string
}

export interface Medicine {
  id: string | number
  name: string
  description?: string
  category?: string
  form?: string
  usage?: string
  details?: string
  sideEffects?: string
  imageUrl?: string
  createdAt?: string
}
