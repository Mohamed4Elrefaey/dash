import {
  apiClient,
  setToken,
  setStoredUser,
  removeToken,
} from "@/lib/api-client"

interface LoginResponse {
  token: string
  user?: {
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
    try {
      const response = await apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: credentials, // JSON Map { email, password }
      })

      if (!response?.token) {
        throw new Error("لم يتم استلام رمز الدخول من الخادم")
      }

      // Save token
      setToken(response.token)

      // Save user info (if backend returns it)
      setStoredUser(
        response.user || {
          name: credentials.email,
          role: "Admin",
        }
      )

      return response
    } catch (error: any) {
      console.error("Login error:", error)

      // Show backend message if exists
      if (error?.message) {
        throw new Error(error.message)
      }

      throw new Error("حدث خطأ في الاتصال بالخادم")
    }
  },

  logout: () => {
    removeToken()
  },
}
