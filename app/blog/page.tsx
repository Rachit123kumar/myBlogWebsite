import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Heart, ArrowRight } from "lucide-react"

import Blog from "@/models/blog"
import { connectToDatabase } from "@/lib/db"


export const revalidate=60;


export const metadata: Metadata = {
  title: "Blog | AI-Generated Content Hub",
  description:
    "Explore expertly crafted blogs on technology, business, startups, and innovation—all generated using advanced AI.",
  keywords: ["AI blog", "technology", "business", "startup", "web development", "innovation"],
  openGraph: {
    title: "Blog | AI-Generated Content Hub",
    description: "Explore expert insights and trends powered by AI.",
    url: "https://yourdomain.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | AI-Generated Content Hub",
    description: "Explore expert insights and trends powered by AI.",
  },
}

const getBlogPosts = async () => {
  await connectToDatabase()
  const blogs = await Blog.find() // Ensure visibility spelling is correct
    .sort({ publishedAt: -1 })
    .lean()

  return blogs.map((post: any) => ({
    ...post,
    excerpt: post.excerpt || post.content.slice(0, 160) + "...",
    tags: post.tags || [],
    likes: post.likes || 0,
    readTime: post.readTime || Math.ceil(post.wordCount / 200) || 3,
  }))
}

export default async function Page() {
  const posts = await getBlogPosts()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AI-Generated Content Hub",
    description: "Expert blogs on technology, business, and innovation",
    url: "https://yourdomain.com/blog",
    blogPost: posts.map((post: any) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://yourdomain.com/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author,
      },
      keywords: post.tags.join(", "),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
            📚 Featured Blog Posts
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Explore expertly crafted articles powered by AI on topics like business, startups,
            innovation, and development.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Card key={post._id} className="bg-white shadow-md hover:shadow-lg transition duration-300">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl font-semibold line-clamp-2 hover:text-blue-600 transition">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <p className="text-gray-500 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <span className="text-xs flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      {post.likes}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <Button className="w-full">
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
