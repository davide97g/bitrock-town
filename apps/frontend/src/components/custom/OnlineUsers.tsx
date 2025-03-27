import { Clock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocketContext } from "@/context/WebSocketProvider";
import { formatTime } from "@/services/utils";

interface OnlineUsersProps {
  className?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function OnlineUsers({
  className,
  position = "top-right",
}: OnlineUsersProps) {
  // Position classes based on the position prop
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  const { usersStatus } = useWebSocketContext();

  return (
    <div
      className={`absolute ${positionClasses[position]} w-64 bg-background border rounded-lg shadow-md z-50 ${className}`}
    >
      <div className="p-3 border-b">
        <h3 className="font-medium">Online Users</h3>
      </div>

      <ScrollArea className="h-80">
        <div className="p-2">
          {usersStatus.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={"/placeholder.svg?height=40&width=40"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${user.status === "online" ? "bg-green-500" : "bg-gray-300"}`}
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>
                    {user.status === "online"
                      ? "Online now"
                      : `Last seen ${formatTime(user.lastUpdated)}`}
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
