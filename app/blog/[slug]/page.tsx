import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import Blog from "@/models/blog"
import BlogPostContent from "@/components/myComponent/blog-post-display"

type BlogPost = {
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

const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  await connectToDatabase()
  const post = (await Blog.findOne({ slug }).lean()) as any

  if (!post) return null

  return {
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.content.slice(0, 160).replace(/[#_*]/g, ""),
    tags: post.tags || [],
    publishedAt: new Date(post.publishedAt).toISOString(),
    readTime: post.readTime,
    likes: post.likes,
    author: post.author,
    wordCount: post.wordCount,
    characterCount: post.characterCount,
    visibilty: post.visibilty,
  }
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found | My Blog",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | My Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://yourdomain.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) return notFound()

  // Schema.org JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "My Blog",
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
    timeRequired: `PT${post.readTime}M`,
    articleBody: post.content,
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostContent post={post} />
    </div>
  )
}

export async function generateStaticParams() {
  await connectToDatabase()
  const posts = await Blog.find({ visibilty: "public" }, "slug").lean()
  return posts.map((post: any) => ({ slug: post.slug }))
}
