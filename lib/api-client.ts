const BASE_URL =
  typeof window !== "undefined"
    ? "/api-proxy"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "https://vax.teqnyah.com/api"

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  isFormData?: boolean
}

/* =========================
   Api Error Class
========================= */
export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

/* =========================
   Token Helpers
========================= */
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("khatwa_token")
}

export function setToken(token: string): void {
  localStorage.setItem("khatwa_token", token)
}

export function removeToken(): void {
  localStorage.removeItem("khatwa_token")
  localStorage.removeItem("khatwa_user")
}

/* =========================
   User Helpers
========================= */
export function getStoredUser(): { name: string; role: string; email?: string } | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("khatwa_user")
  return stored ? JSON.parse(stored) : null
}

export function setStoredUser(user: { name: string; role: string; email?: string }): void {
  localStorage.setItem("khatwa_user", JSON.stringify(user))
}

/* =========================
   API Client
========================= */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, isFormData = false } = options

  const token = getToken()

  const config: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body)
  }

  let res: Response

  if (process.env.NODE_ENV === "development") {
    console.log(`🚀 Request: ${method} ${endpoint}`, body)
  }

  try {
    res = await fetch(`${BASE_URL}${endpoint}`, config)
  } catch (err) {
    console.error(`❌ Network Error: ${method} ${endpoint}`, err)
    throw new ApiError("تعذر الاتصال بالخادم، تحقق من الإنترنت", 0)
  }

  // 🔐 Unauthorized
  if (res.status === 401) {
    // Only redirect if NOT on login page
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      removeToken()
      window.location.href = "/"
      throw new ApiError(
        "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى",
        401
      )
    }
    // If on login page, let it pass to handle "Invalid credentials"
  }

  // ❌ Other errors
  if (!res.ok) {
    let errorData: any = {}
    try {
      errorData = await res.json()
    } catch {}

    if (process.env.NODE_ENV === "development") {
      console.error(`❌ API Error: ${method} ${endpoint} (${res.status})`, errorData)
    }

    let message = errorData.message || errorData.error

    if (!message && errorData.errors) {
      const firstError = Object.values(errorData.errors)[0]
      if (Array.isArray(firstError)) message = firstError[0]
      else if (typeof firstError === "string") message = firstError
    }

    if (!message) {
      message = getArabicErrorMessage(res.status)
    }

    throw new ApiError(message, res.status, errorData.errors)
  }

  // ✅ Success (handle empty response)
  const text = await res.text()

  if (process.env.NODE_ENV === "development") {
    console.log(`✅ Response: ${method} ${endpoint}`, text ? JSON.parse(text) : "Empty")
  }

  if (!text) return {} as T
  return JSON.parse(text) as T
}

/* =========================
   Arabic Error Messages
========================= */
function getArabicErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "البيانات المدخلة غير صحيحة"
    case 403:
      return "ليس لديك صلاحية للوصول"
    case 404:
      return "العنصر المطلوب غير موجود"
    case 409:
      return "يوجد تعارض في البيانات"
    case 422:
      return "البيانات المدخلة غير مكتملة"
    case 500:
      return "حدث خطأ في الخادم، يرجى المحاولة لاحقاً"
    default:
      return `حدث خطأ غير متوقع (${status})`
  }
}
