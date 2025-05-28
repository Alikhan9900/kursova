"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Database, Users, Wrench } from "lucide-react"

interface DemoStatus {
  databaseConnected: boolean
  tablesExist?: boolean
  demoExists: boolean
  credentials?: Array<{ email: string; password: string; role: string }>
  error?: string
}

export function DemoSetup() {
  const [status, setStatus] = useState<DemoStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)

  useEffect(() => {
    checkDemoStatus()
  }, [])

  const checkDemoStatus = async () => {
    try {
      const response = await fetch("/api/setup-demo", { method: "GET" })
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Demo status check error:", error)
      setStatus({
        databaseConnected: false,
        demoExists: false,
        error: "Failed to check demo status",
      })
    }
  }

  const setupDemo = async () => {
    setIsLoading(true)
    setSetupError(null)

    try {
      const response = await fetch("/api/setup-demo", { method: "POST" })
      const data = await response.json()

      if (response.ok) {
        await checkDemoStatus() // Refresh status
      } else {
        setSetupError(data.details || data.error || "Setup failed")
      }
    } catch (error) {
      setSetupError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (!status) {
    return (
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">Checking demo status...</AlertDescription>
      </Alert>
    )
  }

  // Database connection error
  if (!status.databaseConnected) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <div className="space-y-2">
            <p className="font-medium">❌ Database Connection Failed</p>
            <p className="text-sm">{status.error}</p>
            <p className="text-sm">Please check your database configuration.</p>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Tables don't exist
  if (status.databaseConnected && status.tablesExist === false) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <Wrench className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <div className="space-y-2">
            <p className="font-medium">⚠️ Database Tables Missing</p>
            <p className="text-sm">The database is connected but tables haven't been created yet.</p>
            <p className="text-sm">
              This usually happens on first deployment. Try redeploying the project or check Vercel function logs.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Demo already exists
  if (status.demoExists && status.credentials) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <div className="space-y-2">
            <p className="font-medium">✅ Demo Ready!</p>
            <div className="text-sm space-y-1">
              {status.credentials.map((cred, index) => (
                <p key={index}>
                  <strong>{cred.role}:</strong> {cred.email} / {cred.password}
                </p>
              ))}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Demo setup required
  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <Database className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">🚀 Demo Setup Required</p>
            <p className="text-sm">Click to create demo accounts and content</p>
            {setupError && (
              <p className="text-red-600 text-sm">
                <strong>Error:</strong> {setupError}
              </p>
            )}
          </div>
          <Button onClick={setupDemo} disabled={isLoading} size="sm" className="ml-4">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Setup Demo
              </>
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
