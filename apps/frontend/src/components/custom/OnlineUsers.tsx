"use client";

import { Clock } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTime } from "@/services/utils";

// Sample user data - in a real app, this would come from your API
const users = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).getTime(), // 2 minutes ago
    online: true,
  },
  {
    id: 2,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).getTime(), // 5 minutes ago
    online: true,
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).getTime(), // 15 minutes ago
    online: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).getTime(), // 30 minutes ago
    online: false,
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).getTime(), // 1 hour ago
    online: false,
  },
];

interface OnlineUsersProps {
  className?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function OnlineUsers({
  className,
  position = "top-right",
}: OnlineUsersProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update the time every minute to keep "last seen" times fresh
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Position classes based on the position prop
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} w-64 bg-background border rounded-lg shadow-md z-50 ${className}`}
    >
      <div className="p-3 border-b">
        <h3 className="font-medium">Online Users</h3>
      </div>

      <ScrollArea className="h-80">
        <div className="p-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${user.online ? "bg-green-500" : "bg-gray-300"}`}
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>
                    {user.online
                      ? "Online now"
                      : `Last seen ${formatTime(user.lastSeen)}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
