import { Clock, Send } from "lucide-react";

import { useGetChatMessages } from "@/api/chat/useGetChatMessages";
import { useSendChatMessage } from "@/api/chat/useSendChatMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/context/Auth/AuthProvider";
import { useWebSocketContext } from "@/context/WebSocketProvider";
import { formatTime } from "@/services/utils";
import { IChatMessage } from "@bitrock-town/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

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

  const { session } = useAuth();
  const { usersStatus } = useWebSocketContext();
  const sendChatMessage = useSendChatMessage();
  const messages = useGetChatMessages();

  const [newMessages, setNewMessages] = useState<IChatMessage[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("new-message-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "MESSAGES" },
        (payload) => {
          console.log("Change received!", payload);
          setNewMessages((prev) => [...prev, payload.new as IChatMessage]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const [input, setInput] = useState("");

  const authUser = session?.user;

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
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.name} {user.id === authUser?.id ? "(you)" : ""}
                </p>
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

          <Separator />

          <div className="p-2 flex flex-col gap-2">
            {messages.data?.map((m) => (
              <p>{m.content}</p>
            ))}
          </div>

          <Separator />

          <div className="p-2 flex flex-col gap-2">
            {newMessages.map((m) => (
              <p>{m.content}</p>
            ))}
          </div>

          <div className="flex gap-2 absolute bottom-0 left-0 p-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              type="submit"
              onClick={() => {
                sendChatMessage.mutate(input);
                setInput("");
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
