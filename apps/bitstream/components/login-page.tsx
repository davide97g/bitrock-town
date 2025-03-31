"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)

    // Simulate login delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Company Chat</CardTitle>
          <CardDescription className="text-center">Sign in with your company Google account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button
            variant="outline"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : <Icons.google className="h-4 w-4" />}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-center text-muted-foreground">
          Only company email addresses are allowed
        </CardFooter>
      </Card>
    </div>
  )
}

