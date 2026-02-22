import { apiClient } from "@/lib/api-client"

export interface ArticlePayload {
  title: string
  description: string
  content: string
  category: string
  imageUrl: string
}

export const articlesService = {
  getAll: () => apiClient<unknown[]>("/api/articles"),
  getById: (id: string) => apiClient<unknown>(`/api/articles/${id}`),
  create: (data: ArticlePayload) => apiClient<unknown>("/api/articles", { method: "POST", body: data }),
}
