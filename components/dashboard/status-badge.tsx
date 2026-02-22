interface StatusBadgeProps {
  status: "تم" | "متأخر" | "قادم" | "إلزامي" | "اختياري"
}

const statusStyles: Record<string, string> = {
  "تم": "bg-[#e8f5f1] text-[#2d7a6b]",
  "متأخر": "bg-destructive/10 text-destructive",
  "قادم": "bg-muted text-muted-foreground",
  "إلزامي": "bg-[#e8f5f1] text-[#2d7a6b]",
  "اختياري": "bg-[#fef3c7] text-[#92400e]",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  )
}
