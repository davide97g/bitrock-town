"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { currentUser } from "@/lib/mock-data"

export function Sidebar() {
  const router = useRouter()

  const handleSignOut = async () => {
    router.push("/")
  }

  const navigateToDashboard = () => {
    router.push("/dashboard")
  }

  const initials = currentUser.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"

  return (
    <div className="w-64 bg-slate-100 dark:bg-slate-800 p-4 flex flex-col h-full border-r border-border">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-xl font-bold">Company Chat</h1>
      </div>

      <nav className="space-y-2 flex-1">
        <Button variant="ghost" className="w-full justify-start" onClick={navigateToDashboard}>
          <Icons.users className="mr-2 h-4 w-4" />
          Rooms
        </Button>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={currentUser.image || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-muted-foreground text-xs">{currentUser.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <Icons.logout className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

