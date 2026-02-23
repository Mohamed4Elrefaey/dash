import { apiClient } from "@/lib/api-client"

export interface ArticlePayload {
  title: string
  description: string
  content: string
  category: string
  imageUrl: string
}

export interface Article {
  id: string | number
  title: string
  description?: string
  content?: string
  category?: string
  imageUrl?: string
  author?: string
  createdAt?: string
  status?: string
  [key: string]: unknown
}

export const articlesService = {
  getAll: () => apiClient<Article[]>("/api/articles"),
  getById: (id: string | number) => apiClient<Article>(`/api/articles/${id}`),
  create: (data: ArticlePayload) => apiClient<Article>("/api/articles", { method: "POST", body: data }),
}
