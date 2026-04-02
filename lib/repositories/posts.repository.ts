import { postsService, CreatePostDto } from "@/lib/services/posts"

export const postsRepository = {
  getPosts: async (page?: number, limit?: number) => {
    const response = await postsService.getAll(page, limit)
    return response.data
  },

  createPost: (data: CreatePostDto) => postsService.create(data),
}
