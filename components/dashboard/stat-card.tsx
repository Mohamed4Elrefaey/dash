import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  iconBgColor?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-primary/10",
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
      <div>
        {trend && (
          <span
            className={`mb-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
              trend.positive
                ? "bg-accent text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor}`}>
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  )
}
