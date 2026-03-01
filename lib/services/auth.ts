import {
  apiClient,
  setToken,
  setStoredUser,
  removeToken,
} from "@/lib/api-client"
import { LoginCredentials, LoginResponse, RegisterDto } from "@/lib/models/auth.model"

interface ValidationResult {
  valid: boolean
  errors: {
    email?: string
    password?: string
  }
}

/* -------------------------
   Form Validation
-------------------------- */
export function validateLoginForm(
  email: string,
  password: string
): ValidationResult {
  const errors: ValidationResult["errors"] = {}

  if (!email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب"
  } else if (email.trim().length < 3) {
    errors.email = "البريد الإلكتروني يجب أن يكون 3 أحرف على الأقل"
  }

  if (!password) {
    errors.password = "كلمة المرور مطلوبة"
  } else if (password.length < 6) {
    errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/* -------------------------
   Auth Service
-------------------------- */
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: credentials,
    })

    if (response?.token) {
      setToken(response.token)
      setStoredUser(response.user)
    }

    return response
  },

  register: async (data: RegisterDto): Promise<void> => {
    await apiClient("/auth/register", {
      method: "POST",
      body: data,
    })
  },

  logout: () => {
    removeToken()
  },
}
