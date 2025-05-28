"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, FileText, MessageCircle, Tags, Plus } from "lucide-react"

function AdminContent() {
  const { data: session } = useSession()

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog content and users</p>
          </div>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Demo users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Demo posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Demo comments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Demo tags</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Manage Posts</CardTitle>
              <CardDescription>Create, edit, and manage blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/admin/posts/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Post
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/posts">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Posts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Tags</CardTitle>
              <CardDescription>Organize content with tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Tag (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <Tags className="mr-2 h-4 w-4" />
                  View All Tags (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <Users className="mr-2 h-4 w-4" />
                View All Users (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>Current state of your blog platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">✅ Working Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• User authentication and authorization</li>
                  <li>• Blog post creation and editing</li>
                  <li>• Post management (publish/unpublish)</li>
                  <li>• Tag system for categorization</li>
                  <li>• Comment system</li>
                  <li>• Responsive design with dark mode</li>
                  <li>• Admin and user dashboards</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🚧 Coming Soon</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Rich text editor</li>
                  <li>• Image upload and management</li>
                  <li>• Advanced user management</li>
                  <li>• Analytics and reporting</li>
                  <li>• Email notifications</li>
                  <li>• Advanced search and filtering</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      <AdminContent />
    </AuthGuard>
  )
}
