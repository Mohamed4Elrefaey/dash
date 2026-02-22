"use client"

import { AlertTriangle, CheckCircle, Trash2, X } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "success"
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const iconMap = {
    danger: <AlertTriangle className="h-8 w-8 text-destructive" />,
    warning: <AlertTriangle className="h-8 w-8 text-warning" />,
    success: <CheckCircle className="h-8 w-8 text-primary" />,
  }

  const buttonStyleMap = {
    danger: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    warning: "bg-warning/10 text-warning hover:bg-warning/20",
    success: "bg-primary text-primary-foreground hover:opacity-90",
  }

  const confirmIconMap = {
    danger: <Trash2 className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl">
        <div className="relative px-6 pt-8 pb-4 text-center">
          <button
            onClick={onClose}
            className="absolute start-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            {iconMap[variant]}
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
        </div>
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all disabled:opacity-50 ${buttonStyleMap[variant]}`}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              confirmIconMap[variant]
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
