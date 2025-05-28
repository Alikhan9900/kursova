"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PostForm } from "@/components/admin/post-form"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditPostPage() {
  const params = useParams()
  const postId = params.id as string

  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      <div className="container py-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/admin/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Post</h1>
              <p className="text-muted-foreground">Update your blog post</p>
            </div>
          </div>
          <PostForm postId={postId} />
        </div>
      </div>
    </AuthGuard>
  )
}
