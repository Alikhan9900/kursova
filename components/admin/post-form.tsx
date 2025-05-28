"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, Save } from "lucide-react"

interface PostFormProps {
  postId?: string
}

interface Tag {
  id: string
  name: string
  color: string
}

interface PostData {
  title: string
  content: string
  excerpt: string
  published: boolean
  featured: boolean
  tags: Array<{ tag: { name: string } }>
}

export function PostForm({ postId }: PostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    published: false,
    featured: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchTags()
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags")
      if (response.ok) {
        const data = await response.json()
        setAvailableTags(data.tags || [])
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    }
  }

  const fetchPost = async () => {
    if (!postId) return

    try {
      const response = await fetch(`/api/admin/posts/${postId}`)
      if (response.ok) {
        const post: PostData = await response.json()
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || "",
          published: post.published,
          featured: post.featured,
        })
        setSelectedTags(post.tags?.map((t) => t.tag.name) || [])
      } else {
        throw new Error("Failed to fetch post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      })
      router.push("/admin/posts")
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > 200) {
      newErrors.title = "Title is too long (max 200 characters)"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        tags: selectedTags,
      }

      const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts"
      const method = postId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Post ${postId ? "updated" : "created"} successfully`,
        })
        router.push("/admin/posts")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to save post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const addExistingTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{postId ? "Edit Post" : "Create New Post"}</CardTitle>
            <CardDescription>
              {postId ? "Update your blog post content" : "Write your blog post content"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your post..."
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  rows={15}
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  className={errors.content ? "border-red-500" : ""}
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/posts")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Post Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Post Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Published</p>
                <p className="text-sm text-muted-foreground">Make this post visible to readers</p>
              </div>
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => handleInputChange("published", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Featured</p>
                <p className="text-sm text-muted-foreground">Show on homepage</p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add tags to categorize your post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Tag */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Add New Tag:</p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Tag name..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Existing Tags */}
            {availableTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Existing Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter((tag) => !selectedTags.includes(tag.name))
                    .map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer"
                        style={{ borderColor: tag.color, color: tag.color }}
                        onClick={() => addExistingTag(tag.name)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
