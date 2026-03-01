export interface AdminStats {
  totalChildren?: number
  totalVaccinations?: number
  complianceRate?: number
  lateVaccinations?: number
  activeRecordsToday?: number
}

export interface ForecastData {
  month?: string
  predicted?: number
  actual?: number
}

export interface ChildrenByAge {
  ageGroup?: string
  count?: number
  percentage?: number
}

export interface VaccinationCoverage {
  vaccine?: string
  coverage?: number
}
