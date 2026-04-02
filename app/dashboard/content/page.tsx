"use client"

import { useState, useEffect } from "react"
import { Plus, Search, FileText, Eye, Pencil, Trash2, X, CheckCircle, MessageSquare } from "lucide-react"
import { articlesRepository } from "@/lib/repositories/articles.repository"
import { postsRepository } from "@/lib/repositories/posts.repository"
import { Post, CreatePostDto } from "@/lib/services/posts"
import { type Article, type CreateArticleDto as ArticlePayload } from "@/lib/models/article.model"
import { LoadingSpinner } from "@/components/dashboard/loading-spinner"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { StatCard } from "@/components/dashboard/stat-card"
import { toast } from "sonner"

const tabs = [
  { id: "articles", label: "المقالات" },
  { id: "community", label: "منشورات المجتمع" },
  { id: "sounds", label: "أصوات الاسترخاء" },
]

const categories = ["التغذية", "التطعيمات", "الاسترخاء", "النمو والتطور", "الصحة النفسية"]
const statuses = ["الكل", "منشور", "مسودة", "قيد المراجعة"]

export default function ContentPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("articles")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeStatus, setActiveStatus] = useState("الكل")
  const [activeCategory, setActiveCategory] = useState("الكل")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [addLoading, setAddLoading] = useState(false)
  const [postAddLoading, setPostAddLoading] = useState(false)
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "articles") {
      fetchArticles()
    } else if (activeTab === "community") {
      fetchPosts()
    }
  }, [activeTab])

  async function fetchArticles() {
    try {
      setLoading(true)
      const data = await articlesRepository.getArticles()
      setArticles(data)
    } catch {
      toast.error("تعذر تحميل المقالات")
    } finally {
      setLoading(false)
    }
  }

  async function fetchPosts() {
    try {
      setPostsLoading(true)
      const data = await postsRepository.getPosts()
      setPosts(data)
    } catch {
      toast.error("تعذر تحميل منشورات المجتمع")
    } finally {
      setPostsLoading(false)
    }
  }

  async function handleAddPost(data: CreatePostDto) {
    setPostAddLoading(true)
    try {
      await postsRepository.createPost(data)
      toast.success("تم إضافة المنشور بنجاح")
      setIsPostModalOpen(false)
      fetchPosts()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر إضافة المنشور")
    } finally {
      setPostAddLoading(false)
    }
  }

  async function handleAddArticle(data: ArticlePayload) {
    setAddLoading(true)
    try {
      await articlesRepository.createArticle(data)
      toast.success("تم إضافة المقال بنجاح")
      setIsAddModalOpen(false)
      fetchArticles()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر إضافة المقال")
    } finally {
      setAddLoading(false)
    }
  }

  async function handleUpdateArticle(data: ArticlePayload) {
    if (!editingArticle) return
    setAddLoading(true)
    try {
      await articlesRepository.updateArticle(editingArticle.id, data)
      toast.success("تم تحديث المقال بنجاح")
      setIsAddModalOpen(false)
      setEditingArticle(null)
      fetchArticles()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحديث المقال")
    } finally {
      setAddLoading(false)
    }
  }

  async function handleDeleteArticle() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await articlesRepository.deleteArticle(deleteTarget.id)
      toast.success("تم حذف المقال بنجاح")
      setDeleteTarget(null)
      fetchArticles()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر حذف المقال")
    } finally {
      setDeleteLoading(false)
    }
  }

  async function handleViewArticle(article: Article) {
    try {
      const full = await articlesRepository.getArticleById(article.id)
      setViewingArticle(full)
    } catch {
      setViewingArticle(article)
    }
  }

  const filteredArticles = articles.filter((a) => {
    const matchesSearch = a.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = activeStatus === "الكل" || a.status === activeStatus
    const matchesCategory = activeCategory === "الكل" || a.category === activeCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (loading) return <LoadingSpinner message="جارٍ تحميل المحتوى..." />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ادارة المحتوى</h1>
        <p className="text-sm text-muted-foreground">إدارة المقالات والمنتدي والمواد السمعية</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="اجمالي المقالات" value={articles.length.toString()} icon={FileText} iconBgColor="bg-[#e8f5f1]" />
        <StatCard title="اجمالي المنشورات" value="---" icon={FileText} iconBgColor="bg-[#e8f5f1]" />
        <StatCard title="اجمالي الاصوات الهادئة" value="---" icon={FileText} iconBgColor="bg-[#e8f5f1]" />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "articles" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => {
                setEditingArticle(null)
                setIsAddModalOpen(true)
              }}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />انشاء مقال جديد
            </button>
          </div>

          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="ابحث في المقالات" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-border bg-card py-2.5 ps-11 pe-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {statuses.map((s) => (
              <button key={s} onClick={() => setActiveStatus(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeStatus === s ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}>{s}</button>
            ))}
            <span className="mx-2 h-4 w-px bg-border" />
            <button onClick={() => setActiveCategory("الكل")} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeCategory === "الكل" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}>الكل</button>
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeCategory === c ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}>{c}</button>
            ))}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
              <p className="text-muted-foreground">{searchQuery ? "لم يتم العثور على مقالات" : "لا توجد مقالات"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <div key={article.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="h-40 bg-muted">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center"><FileText className="h-12 w-12 text-muted-foreground/30" /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {article.category && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{article.category}</span>}
                      {article.status && <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${article.status === "منشور" ? "bg-[#e8f5f1] text-[#2d7a6b]" : article.status === "مسودة" ? "bg-muted text-muted-foreground" : "bg-[#fef3c7] text-[#92400e]"}`}>{article.status}</span>}
                    </div>
                    <h3 className="mb-1 font-bold text-foreground line-clamp-2">{article.title}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">{article.description}</p>
                    <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                      {article.author && <span>{article.author}</span>}
                      {article.createdAt && <span>{article.createdAt}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewArticle(article)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"><Eye className="h-3.5 w-3.5" />عرض</button>
                      <button
                        onClick={() => {
                          setEditingArticle(article)
                          setIsAddModalOpen(true)
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />تعديل
                      </button>
                      <button onClick={() => setDeleteTarget(article)} className="inline-flex items-center gap-1 rounded-lg border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors"><Trash2 className="h-3.5 w-3.5" />حذف</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "community" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />انشاء منشور جديد
            </button>
          </div>

          {postsLoading ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
              <LoadingSpinner message="جارٍ تحميل المنشورات..." />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
              <p className="text-muted-foreground">لا توجد منشورات متاحة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="h-40 bg-muted">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-bold text-foreground line-clamp-1">{post.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {post.author && <span>{post.author}</span>}
                      {post.createdAt && <span>{post.createdAt}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "sounds" && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
          <p className="text-muted-foreground">أصوات الاسترخاء - قريباً</p>
        </div>
      )}

      {/* View Article Modal */}
      {viewingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-xl">
            <div className="relative border-b border-border px-6 py-5">
              <h2 className="pe-8 text-xl font-bold text-foreground">{viewingArticle.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                {viewingArticle.category && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">{viewingArticle.category}</span>}
                {viewingArticle.author && <span>{viewingArticle.author}</span>}
              </div>
              <button onClick={() => setViewingArticle(null)} className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted" aria-label="إغلاق"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-5">
              {viewingArticle.imageUrl && <img src={viewingArticle.imageUrl} alt={viewingArticle.title} className="mb-4 h-48 w-full rounded-xl object-cover" />}
              {viewingArticle.description && <p className="mb-3 text-sm font-medium text-foreground">{viewingArticle.description}</p>}
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{viewingArticle.content || "لا يوجد محتوى"}</div>
            </div>
            <div className="border-t border-border px-6 py-4 text-center">
              <button onClick={() => setViewingArticle(null)} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Article Modal */}
      <AddArticleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingArticle(null)
        }}
        onSubmit={editingArticle ? handleUpdateArticle : handleAddArticle}
        loading={addLoading}
        initialData={editingArticle}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteArticle}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف المقال "${deleteTarget?.title}"؟`}
        confirmLabel="نعم، احذف"
        variant="danger"
        loading={deleteLoading}
      />

      {/* Add Post Modal */}
      <AddPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleAddPost}
        loading={postAddLoading}
      />
    </div>
  )
}

function AddPostModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePostDto) => void
  loading: boolean
}) {
  const [form, setForm] = useState<CreatePostDto>({ title: "", content: "", imageUrl: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setForm({ title: "", content: "", imageUrl: "" })
      setErrors({})
    }
  }, [isOpen])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "عنوان المنشور مطلوب"
    if (!form.content.trim()) errs.content = "محتوى المنشور مطلوب"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  if (!isOpen) return null
  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive"
        : "border-border bg-card focus:border-primary focus:ring-primary"
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 text-start">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-xl" dir="rtl">
        <div className="relative border-b border-border px-6 py-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <MessageSquare className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">انشاء منشور جديد</h2>
          <p className="mt-1 text-sm text-muted-foreground">شارك تجربتك مع المجتمع</p>
          <button
            onClick={onClose}
            className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              عنوان المنشور <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass("title")}
              placeholder="ادخل عنوان المنشور"
            />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              محتوى المنشور <span className="text-destructive">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5}
              className={`${inputClass("content")} resize-none`}
              placeholder="ماذا تريد ان تشارك؟"
            />
            {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">رابط الصورة</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className={inputClass("")}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 border-t border-border px-6 py-4">
          <button
            onClick={() => {
              if (validate()) onSubmit(form)
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            إضافة المنشور
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}

function AddArticleModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  initialData,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ArticlePayload) => void
  loading: boolean
  initialData?: Article | null
}) {
  const [form, setForm] = useState<ArticlePayload>({
    title: "",
    description: "",
    content: "",
    category: "",
    imageUrl: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title || "",
          description: initialData.description || "",
          content: initialData.content || "",
          category: initialData.category || "",
          imageUrl: initialData.imageUrl || "",
        })
      } else {
        setForm({ title: "", description: "", content: "", category: "", imageUrl: "" })
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "عنوان المقال مطلوب"
    if (!form.content.trim()) errs.content = "محتوى المقال مطلوب"
    if (!form.category) errs.category = "التصنيف مطلوب"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  if (!isOpen) return null
  const inputClass = (field: string) => `w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${errors[field] ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive" : "border-border bg-card focus:border-primary focus:ring-primary"}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-xl">
        <div className="relative border-b border-border px-6 py-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? "تعديل المقال" : "انشاء مقال جديد"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {initialData ? "قم بتعديل بيانات المقال" : "قم بإدخال بيانات المحتوى لإضافته إلى النظام"}
          </p>
          <button
            onClick={onClose}
            className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">عنوان المقال <span className="text-destructive">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass("title")} placeholder="ادخل عنوان المقال" />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">التصنيف <span className="text-destructive">*</span></label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass("category")}>
              <option value="">اختر التصنيف</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">وصف مختصر</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass("")} placeholder="اكتب وصفاً مختصراً" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">محتوى المقال <span className="text-destructive">*</span></label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className={`${inputClass("content")} resize-none`} placeholder="اكتب المحتوى الكامل للمقال هنا..." />
            {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">رابط الصورة</label>
            <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className={inputClass("")} placeholder="https://..." />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 border-t border-border px-6 py-4">
          <button
            onClick={() => {
              if (validate()) onSubmit(form)
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {initialData ? "حفظ التغييرات" : "إضافة"}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
