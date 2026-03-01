export interface CreateVaccineDto {
  name: string
  description: string
  ageInMonths: number
  doseInfo?: string
  mandatory: boolean
}

export interface Vaccine {
  id: string | number
  name: string
  description: string
  ageInMonths: number
  doseInfo?: string
  mandatory: boolean
  coveragePercent?: number // Extracted from meta or stats if needed
  type?: string // For UI consistency (e.g. "إلزامي" | "اختياري")
  targetAge?: string // For UI consistency
  doses?: string // For UI consistency
}
