"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Mock data - in a real app, this would come from your analytics
const monthlyData = [
  { month: "Jan", views: 4200 },
  { month: "Feb", views: 3800 },
  { month: "Mar", views: 5100 },
  { month: "Apr", views: 4600 },
  { month: "May", views: 5800 },
  { month: "Jun", views: 6200 },
  { month: "Jul", views: 5900 },
  { month: "Aug", views: 6800 },
  { month: "Sep", views: 7200 },
  { month: "Oct", views: 6900 },
  { month: "Nov", views: 7800 },
  { month: "Dec", views: 8200 },
]

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
}

export function MonthlyViewsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Views</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={60} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
