"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, Share2, Calendar, Clock, User, ArrowLeft, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  keywords: string[]
  tags: string[]
  publishedAt: string
  readTime: number
  likes: number
  author: string
}

interface BlogPostContentProps {
  post: BlogPost
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [likes, setLikes] = useState(post.likes)
  const [hasLiked, setHasLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  // Check if user has already liked this post
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")
    const userLiked = likedPosts.includes(post.id)
    setHasLiked(userLiked)

    // Get updated like count from localStorage
    const postLikes = localStorage.getItem(`post-likes-${post.id}`)
    if (postLikes) {
      setLikes(Number.parseInt(postLikes))
    }
  }, [post.id])

  const handleLike = () => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")

    if (hasLiked) {
      // Unlike
      const updatedLikedPosts = likedPosts.filter((id: string) => id !== post.id)
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts))
      const newLikes = likes - 1
      setLikes(newLikes)
      localStorage.setItem(`post-likes-${post.id}`, newLikes.toString())
      setHasLiked(false)
    } else {
      // Like
      likedPosts.push(post.id)
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts))
      const newLikes = likes + 1
      setLikes(newLikes)
      localStorage.setItem(`post-likes-${post.id}`, newLikes.toString())
      setHasLiked(true)
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this article: ${post.title}`

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case "copy":
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
    setShowShareMenu(false)
  }

  const renderMarkdown = (content: string) => {
    // Simple markdown renderer - you might want to use a proper markdown library
    const html = content
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-semibold mb-4 mt-8 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-medium mb-3 mt-6 text-gray-800">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>',
      )
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-2 list-disc">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 mb-2 list-decimal">$1. $2</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/\n/g, "<br />")

    return `<p class="mb-4 text-gray-700 leading-relaxed">${html}</p>`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Engagement Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant={hasLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={hasLiked ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${hasLiked ? "fill-current" : ""}`} />
                {likes} {likes === 1 ? "Like" : "Likes"}
              </Button>

              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowShareMenu(!showShareMenu)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                {showShareMenu && (
                  <Card className="absolute top-full mt-2 left-0 z-20 w-48">
                    <CardContent className="p-2">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleShare("twitter")}
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleShare("facebook")}
                        >
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleShare("linkedin")}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleShare("copy")}
                        >
                          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {copied ? "Copied!" : "Copy Link"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          <Separator className="my-8" />

          {/* Article Footer */}
          <div className="space-y-6">
            {/* Keywords */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Engagement Summary */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Did you find this article helpful?</div>
              <Button
                variant={hasLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={hasLiked ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${hasLiked ? "fill-current" : ""}`} />
                {hasLiked ? "Liked" : "Like"}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  <Link href="/blog/ultimate-guide-web-development" className="hover:text-blue-600">
                    The Ultimate Guide to Web Development
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">Master modern web development with this comprehensive guide...</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  <Link href="/blog/digital-marketing-strategies-that-work" className="hover:text-blue-600">
                    10 Digital Marketing Strategies That Actually Work
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">
                  Proven digital marketing strategies that deliver real results...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
