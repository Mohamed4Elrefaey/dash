const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vax.teqnyah.com"

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options

  const token = typeof window !== "undefined" ? localStorage.getItem("khatwa_token") : null

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `خطأ في الطلب: ${res.status}`)
  }

  return res.json()
}
