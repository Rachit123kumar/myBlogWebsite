import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, TrendingUp } from "lucide-react"

// Mock data - in a real app, this would come from your database
const topPosts = [
  {
    id: 1,
    title: "CSS Grid vs Flexbox",
    views: 2100,
    trend: "+15%",
  },
  {
    id: 2,
    title: "Getting Started with Next.js 15",
    views: 1250,
    trend: "+8%",
  },
  {
    id: 3,
    title: "Building Scalable APIs",
    views: 890,
    trend: "+12%",
  },
  {
    id: 4,
    title: "React Server Components",
    views: 750,
    trend: "+5%",
  },
  {
    id: 5,
    title: "Modern CSS Techniques",
    views: 620,
    trend: "+3%",
  },
]

export function TopPostsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Performing Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPosts.map((post, index) => (
          <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                {index + 1}
              </Badge>
              <div>
                <h4 className="font-medium text-sm leading-tight">{post.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Eye className="h-3 w-3" />
                  {post.views.toLocaleString()} views
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-green-600">
              {post.trend}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
