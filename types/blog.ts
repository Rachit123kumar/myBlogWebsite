export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  publishedAt: string
  readTime: number
  likes: number
  author: string
  wordCount: number
  characterCount: number
  visibilty: string
}

export interface BlogPostContentProps {
  post: BlogPost
}

export interface BlogAnalytics {
  views: number
  uniqueViews: number
  likes: number
  shares: number
  comments: number
}

export interface BlogMetadata {
  title: string
  description: string
  keywords: string[]
  author: string
  publishedAt: string
  modifiedAt: string
  canonicalUrl: string
}
