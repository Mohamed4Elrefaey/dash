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

let mockArticles: Article[] = [
  {
    id: 1,
    title: "أهمية الرضاعة الطبيعية في الشهور الأولى",
    description: "تعرفي على الفوائد الصحية والغذائية للرضاعة الطبيعية لطفلك ولصحتك أيضاً.",
    content: "محتوى كامل عن الرضاعة الطبيعية...",
    category: "التغذية",
    status: "منشور",
    author: "د. سارة أحمد",
    createdAt: "٢٠٢٤/٠٥/١٠",
    imageUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65ee9?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "جدول التطعيمات الإلزامية في مصر ٢٠٢٤",
    description: "الدليل الشامل لكل التطعيمات التي يجب أن يحصل عليها طفلك منذ الولادة.",
    content: "محتوى كامل عن التطعيمات...",
    category: "التطعميات",
    status: "مسودة",
    author: "فريق التحرير",
    createdAt: "٢٠٢٤/٠٥/١٥",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop"
  }
]

export const articlesService = {
  getAll: () => Promise.resolve(mockArticles),
  getById: (id: string | number) => {
    const article = mockArticles.find(a => String(a.id) === String(id))
    return article ? Promise.resolve(article) : Promise.reject(new Error("المقال غير موجود"))
  },
  create: (data: ArticlePayload) => {
    const newArticle: Article = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: "منشور",
      author: "مسؤول النظام",
      createdAt: new Date().toLocaleDateString("ar-EG")
    }
    mockArticles = [newArticle, ...mockArticles]
    return Promise.resolve(newArticle)
  },
  delete: (id: string | number) => {
    mockArticles = mockArticles.filter(a => String(a.id) !== String(id))
    return Promise.resolve({ success: true })
  }
}
