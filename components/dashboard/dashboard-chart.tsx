"use client"

import { useState, useEffect } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { ChevronDown } from "lucide-react"
import { adminRepository } from "@/lib/repositories/admin.repository"
import { type ForecastData } from "@/lib/models/admin.model"

const STATIC_CHART_DATA = [
  { month: "يناير", count: 1800 },
  { month: "فبراير", count: 2500 },
  { month: "مارس", count: 3000 },
  { month: "أبريل", count: 3200 },
  { month: "مايو", count: 4700 },
  { month: "يونيو", count: 4500 },
  { month: "يوليو", count: 4700 },
  { month: "أغسطس", count: 5200 },
  { month: "سبتمبر", count: 6000 },
  { month: "أكتوبر", count: 6000 },
  { month: "نوفمبر", count: 5500 },
  { month: "ديسمبر", count: 5000 },
]

interface DashboardChartProps {
  isStatic?: boolean
}

export function DashboardChart({ isStatic = false }: DashboardChartProps) {
  const [chartData, setChartData] = useState<{ month: string; count: number }[]>(
    isStatic ? STATIC_CHART_DATA : [],
  )
  const [loading, setLoading] = useState(!isStatic)

  useEffect(() => {
    if (isStatic) return

    async function fetchForecast() {
      try {
        const data = await adminRepository.getForecast()
        if (Array.isArray(data) && data.length > 0) {
          setChartData(
            data.map((item: ForecastData) => ({
              month: String(item.month ?? ""),
              count: Number(item.predicted ?? item.actual ?? 0),
            })),
          )
        }
      } catch {
        // Keep fallback data if any
      } finally {
        setLoading(false)
      }
    }
    fetchForecast()
  }, [isStatic])

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          تغطية التطعيمات الشهرية
        </h2>
        <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted">
          ٢٠٢٦
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5bb5a2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5bb5a2" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#5bb5a2"
                strokeWidth={2.5}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
