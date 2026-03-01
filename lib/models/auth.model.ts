export interface User {
  id: string
  name: string
  email: string
  role: string
  nationalId?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name: string
  nationalId: string
  password: string
}
