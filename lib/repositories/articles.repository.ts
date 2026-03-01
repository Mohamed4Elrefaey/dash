import { articlesService } from "@/lib/services/articles"
import { CreateArticleDto } from "@/lib/models/article.model"

export const articlesRepository = {
  getArticles: async (page?: number, limit?: number, category?: string) => {
    const response = await articlesService.getAll(page, limit, category)
    return response.data
  },

  getArticleById: (id: string | number) => articlesService.getById(id),

  createArticle: (data: CreateArticleDto) => articlesService.create(data),
}
