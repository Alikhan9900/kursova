"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, MessageCircle, User, Settings, Plus } from "lucide-react"

function DashboardContent() {
  const { data: session } = useSession()

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session?.user?.name || session?.user?.email}!</p>
          </div>
          <div className="flex items-center space-x-2">
            {session?.user?.role === "ADMIN" && (
              <Button variant="outline" asChild>
                <Link href="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              New Post (Coming Soon)
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No posts yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No comments yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{session?.user?.role || "USER"}</div>
              <p className="text-xs text-muted-foreground">Your account role</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard!</CardTitle>
            <CardDescription>This is your personal space to manage your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">Your dashboard is ready! Here you'll be able to:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Create and manage your blog posts</li>
                <li>View your writing statistics</li>
                <li>Manage your profile settings</li>
                <li>Interact with the community</li>
              </ul>
              <div className="pt-4">
                <Button disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post (Coming Soon)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Create Content</CardTitle>
              <CardDescription>Start writing your next post</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                <Plus className="mr-2 h-4 w-4" />
                New Post (Coming Soon)
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Posts</CardTitle>
              <CardDescription>Edit and organize your content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <FileText className="mr-2 h-4 w-4" />
                View All Posts (Coming Soon)
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  )
}
