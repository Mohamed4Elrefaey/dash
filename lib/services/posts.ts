import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/lib/models/api.model"

export interface Post {
  id: string | number
  title: string
  content: string
  imageUrl?: string
  authorId?: number
  author?: string
  createdAt?: string
}

export interface CreatePostDto {
  title: string
  content: string
  imageUrl?: string
}

export const postsService = {
  getAll: (page = 1, limit = 10) =>
    apiClient<ApiResponse<Post[]>>(`/community?page=${page}&limit=${limit}`),

  create: (data: CreatePostDto) =>
    apiClient<Post>("/community", { method: "POST", body: data }),

  update: (id: string | number, data: Partial<CreatePostDto>) =>
    apiClient<Post>(`/community/${id}`, { method: "PUT", body: data }),

  delete: (id: string | number) =>
    apiClient<void>(`/community/${id}`, { method: "DELETE" }),
}
