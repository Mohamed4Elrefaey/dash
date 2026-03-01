import { authService } from "@/lib/services/auth"
import { LoginCredentials, RegisterDto } from "@/lib/models/auth.model"

export const authRepository = {
  login: (credentials: LoginCredentials) => authService.login(credentials),
  register: (data: RegisterDto) => authService.register(data),
  logout: () => authService.logout(),
}
