import {
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
    // Mock login logic
    const mockResponse: LoginResponse = {
      token: "mock-jwt-token",
      user: {
        name: "مسؤول النظام",
        role: "مدير النظام",
        email: credentials.email,
      },
    }

    // Save token and user
    setToken(mockResponse.token)
    setStoredUser(mockResponse.user!)

    return Promise.resolve(mockResponse)
  },

  logout: () => {
    removeToken()
  },
}
