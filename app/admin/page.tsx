import { Suspense } from "react"
import { DashboardHeader } from "@/components/myComponent/dashboard-header"
import { StatsCards } from "@/components/myComponent/stats-cards"
import { BlogPostsSection } from "@/components/myComponent/blog-post-section"
import { TopPostsSection } from "@/components/myComponent/top-posts-section"
import { MonthlyViewsChart } from "@/components/myComponent/monthly-veiws-chat"
// import { AIContentGenerator } from ""
import { Skeleton } from "@/components/ui/skeleton"



export default function AdminDashboard() {




  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          }
        >
          <StatsCards />
        </Suspense>

     

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Views Chart */}
            <Suspense fallback={<Skeleton className="h-80" />}>
              <MonthlyViewsChart />
            </Suspense>

            {/* Blog Posts Management */}
            <Suspense fallback={<Skeleton className="h-96" />}>
              <BlogPostsSection />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Performing Posts */}
            <Suspense fallback={<Skeleton className="h-96" />}>
              <TopPostsSection />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
