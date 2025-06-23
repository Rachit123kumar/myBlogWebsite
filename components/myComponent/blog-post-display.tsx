"use client"

import { useState, useEffect, JSX } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { BlogPost } from "@/types/blog"
import {
  Heart,
  Share2,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Eye,
} from "lucide-react"

interface BlogPostContentProps {
  post: BlogPost
}

export default function BlogPostContent({ post }: BlogPostContentProps):JSX.Element {
  const [likes, setLikes] = useState<number>(post.likes)
  const [hasLiked, setHasLiked] = useState<boolean>(false)
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [readingProgress, setReadingProgress] = useState<number>(0)
  const [views, setViews] = useState<number>(0)

  // Track reading progress
  useEffect(() => {
    const handleScroll = (): void => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check if user has already liked this post
  useEffect(() => {
    const likedPosts: string[] = JSON.parse(localStorage.getItem("likedPosts") || "[]")
    const userLiked = likedPosts.includes(post.id)
    setHasLiked(userLiked)

    // Get updated like count from localStorage
    const postLikes = localStorage.getItem(`post-likes-${post.id}`)
    if (postLikes) {
      setLikes(Number.parseInt(postLikes, 10))
    }

    // Track view
    // trackView()
  }, [post.id])

  const trackView = async (): Promise<void> => {
    try {
      const sessionId = getSessionId()
      const response = await fetch("/api/blog/views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: post.slug,
          sessionId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setViews(data.views)
      }
    } catch (error) {
      console.error("Failed to track view:", error)
    }
  }

  const getSessionId = (): string => {
    let sessionId = localStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("sessionId", sessionId)
    }
    return sessionId
  }

  const handleLike = (): void => {
    const likedPosts: string[] = JSON.parse(localStorage.getItem("likedPosts") || "[]")

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

  const handleShare = (platform: string): void => {
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

  // Enhanced markdown renderer with proper styling
  const renderMarkdown = (content: string): string => {
    let html = content
      // Headers with proper styling
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mb-6 mt-8 text-gray-900 leading-tight">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-semibold mb-4 mt-8 text-gray-800 leading-tight">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-medium mb-3 mt-6 text-gray-800 leading-tight">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-xl font-medium mb-2 mt-4 text-gray-800">$1</h4>')

      // Text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
      .replace(/~~(.*?)~~/g, '<del class="line-through text-gray-600">$1</del>')

      // Code blocks and inline code
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border"><code class="text-sm font-mono language-$1">$2</code></pre>',
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600 border">$1</code>',
      )

      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors" target="_blank" rel="noopener noreferrer">$1</a>',
      )

      // Images
      .replace(
        /!\[([^\]]*)\]$$([^)]+)$$/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-6 shadow-md border" loading="lazy" />',
      )

      // Lists
      .replace(/^\* (.*$)/gm, '<li class="ml-6 mb-2 list-disc text-gray-700">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-2 list-disc text-gray-700">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 mb-2 list-decimal text-gray-700">$1. $2</li>')

      // Blockquotes
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">$1</blockquote>',
      )

      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-8 border-gray-300">')

      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed text-lg">')
      .replace(/\n/g, "<br />")

    // Wrap in paragraph tags
    html = `<div class="prose prose-lg max-w-none"><p class="mb-4 text-gray-700 leading-relaxed text-lg">${html}</p></div>`

    // Clean up empty paragraphs
    html = html.replace(/<p class="[^"]*">\s*<\/p>/g, "")

    return html
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div className="h-full bg-blue-500 transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

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
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

            {/* Meta Information */}
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
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{views} views</span>
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
          {/* Rendered Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          <Separator className="my-8" />

          {/* Article Footer */}
          <div className="space-y-6">
            {/* Article Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{post.wordCount}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{post.characterCount}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{likes}</div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{views}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
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
      </div>
    </div>
  )
}
