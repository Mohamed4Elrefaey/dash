import { apiClient, setToken, setStoredUser, removeToken, ApiError } from "@/lib/api-client"

interface LoginResponse {
  token: string
  user: {
    name: string
    role: string
    email?: string
  }
}

interface LoginCredentials {
  email: string
  password: string
}

interface ValidationResult {
  valid: boolean
  errors: {
    email?: string
    password?: string
  }
}

export function validateLoginForm(email: string, password: string): ValidationResult {
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

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
      })

      if (response.token) {
        setToken(response.token)
        setStoredUser(response.user || { name: credentials.email, role: "مستخدم" })
      }

      return response
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 400) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        }
        throw new Error(error.message)
      }
      throw new Error("حدث خطأ في الاتصال بالخادم")
    }
  },

  logout: () => {
    removeToken()
  },
}
