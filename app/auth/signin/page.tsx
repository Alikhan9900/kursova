"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Info, User, Lock } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "You have been signed in successfully",
        })
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: "admin" | "user") => {
    setIsLoading(true)

    const credentials = {
      admin: { email: "admin@autoblog.com", password: "admin123" },
      user: { email: "user@autoblog.com", password: "user123" },
    }

    try {
      const result = await signIn("credentials", {
        email: credentials[role].email,
        password: credentials[role].password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Demo Login Failed",
          description: "Please make sure the database is seeded",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Demo Login Success",
          description: `Signed in as ${role}`,
        })
        router.push(role === "admin" ? "/admin" : "/")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Demo login failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Use demo accounts or enter your credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Accounts */}
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="space-y-3">
                <p className="font-medium">🚀 Quick Demo Login:</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={isLoading}
                    className="flex items-center gap-2 justify-start"
                  >
                    <User className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Admin Demo</div>
                      <div className="text-xs opacity-70">admin@autoblog.com / admin123</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin("user")}
                    disabled={isLoading}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Lock className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">User Demo</div>
                      <div className="text-xs opacity-70">user@autoblog.com / user123</div>
                    </div>
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@autoblog.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="admin123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
