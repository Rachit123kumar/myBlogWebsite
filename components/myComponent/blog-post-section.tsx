"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Eye, Calendar, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data - in a real app, this would come from your database
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    status: "published",
    views: 1250,
    createdAt: "2024-01-15",
    author: "John Doe",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    status: "draft",
    views: 0,
    createdAt: "2024-01-14",
    author: "Jane Smith",
  },
  {
    id: 3,
    title: "Building Scalable APIs",
    status: "published",
    views: 890,
    createdAt: "2024-01-13",
    author: "Mike Johnson",
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox",
    status: "published",
    views: 2100,
    createdAt: "2024-01-12",
    author: "Sarah Wilson",
  },
  {
    id: 5,
    title: "TypeScript Best Practices",
    status: "draft",
    views: 0,
    createdAt: "2024-01-11",
    author: "John Doe",
  },
]

export function BlogPostsSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState(mockPosts)

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleStatus = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, status: post.status === "published" ? "draft" : "published" } : post,
      ),
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Blog Posts Management</CardTitle>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {post.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={post.status === "published" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleStatus(post.id)}
                    >
                      {post.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
