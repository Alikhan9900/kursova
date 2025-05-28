"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Plus, Edit, Eye, Trash2, MessageCircle, Search } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  author: {
    name: string | null
    image: string | null
  }
  tags: Array<{
    tag: {
      id: string
      name: string
      color: string
    }
  }>
  _count: {
    comments: number
  }
}

function AdminPostsContent() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else {
        throw new Error("Failed to fetch posts")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId))
        toast({
          title: "Success",
          description: "Post deleted successfully",
        })
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const togglePublished = async (postId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !published }),
      })

      if (response.ok) {
        setPosts(posts.map((post) => (post.id === postId ? { ...post, published: !published } : post)))
        toast({
          title: "Success",
          description: `Post ${!published ? "published" : "unpublished"} successfully`,
        })
      } else {
        throw new Error("Failed to update post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      })
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === "all" || (filter === "published" && post.published) || (filter === "draft" && !post.published)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Posts</h1>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({posts.length})
            </Button>
            <Button
              variant={filter === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("published")}
            >
              Published ({posts.filter((p) => p.published).length})
            </Button>
            <Button variant={filter === "draft" ? "default" : "outline"} size="sm" onClick={() => setFilter("draft")}>
              Drafts ({posts.filter((p) => !p.published).length})
            </Button>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="mx-auto h-24 w-24 text-muted-foreground">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No posts found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by creating your first blog post"}
                  </p>
                </div>
                {!searchTerm && filter === "all" && (
                  <Button asChild>
                    <Link href="/admin/posts/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Post
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(({ tag }) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            style={{
                              backgroundColor: tag.color + "20",
                              color: tag.color,
                            }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt || "No excerpt available"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.featured && <Badge variant="outline">Featured</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>By {post.author.name}</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post._count.comments} comments</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => togglePublished(post.id, post.published)}>
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      {post.published && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminPostsPage() {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      <AdminPostsContent />
    </AuthGuard>
  )
}
