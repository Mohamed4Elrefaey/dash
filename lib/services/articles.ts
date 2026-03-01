import { apiClient } from "@/lib/api-client"
import { Article, CreateArticleDto } from "@/lib/models/article.model"
import { ApiResponse } from "@/lib/models/api.model"

export const articlesService = {
  getAll: (page = 1, limit = 10, category = "") =>
    apiClient<ApiResponse<Article[]>>(`/articles?page=${page}&limit=${limit}&category=${category}`),

  getById: (id: string | number) =>
    apiClient<Article>(`/articles/${id}`),

  create: (data: CreateArticleDto) =>
    apiClient<Article>("/articles", { method: "POST", body: data }),
}
