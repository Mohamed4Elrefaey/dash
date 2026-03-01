export interface ApiResponse<T> {
  success?: boolean
  meta?: {
    totalDocs: number
    totalPages: number
    currentPage: number
    limit: number
  }
  data: T
  message?: string
}

export interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}
