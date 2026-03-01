export interface CreateArticleDto {
  title: string
  description: string
  content: string
  category: string
  imageUrl?: string
}

export interface Article {
  id: string | number
  title: string
  description?: string
  content?: string
  category?: string
  imageUrl?: string
  authorId?: number
  author?: string
  createdAt?: string
  status?: string // "منشور" | "مسودة" etc.
}
