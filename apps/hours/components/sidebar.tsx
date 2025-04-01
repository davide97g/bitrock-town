"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart3, Calendar, Clock, LogOut, Menu, Settings, User, Users, Briefcase } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUserData } from "@/lib/mock-data"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Consuntivazione",
    href: "/consuntivazione",
    icon: Clock,
  },
  {
    title: "Ferie e Permessi",
    href: "/ferie-permessi",
    icon: Calendar,
  },
  {
    title: "Progetti",
    href: "/progetti",
    icon: Briefcase,
  },
  {
    title: "Utenti",
    href: "/utenti",
    icon: Users,
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const userData = getUserData()

  return (
    <div className="relative">
      <motion.div
        className={cn("h-screen bg-background border-r flex flex-col", collapsed ? "w-16" : "w-64")}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 flex justify-between items-center">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-xl"
            >
              Bitrock Hours
            </motion.div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", collapsed ? "px-2" : "px-4")}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {!collapsed && <span>{item.title}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>
                      {userData.name.charAt(0)}
                      {userData.surname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <span className="ml-2 text-sm font-medium">
                      {userData.name} {userData.surname}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilo</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Impostazioni</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {!collapsed && <ModeToggle />}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

