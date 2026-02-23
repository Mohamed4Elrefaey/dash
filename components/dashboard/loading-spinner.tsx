interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "جارٍ التحميل..." }: LoadingSpinnerProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
