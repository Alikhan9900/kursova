"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/auth/signin",
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (requireAuth && !session) {
      router.push(redirectTo)
      return
    }

    if (requireAdmin && session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }
  }, [session, status, requireAuth, requireAdmin, redirectTo, router])

  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null
  }

  if (requireAdmin && session?.user?.role !== "ADMIN") {
    return null
  }

  return <>{children}</>
}
