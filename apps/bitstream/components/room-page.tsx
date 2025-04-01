"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import InviteUserDialog from "@/components/invite-user-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import VideoCallTest from "@/components/VideoChatTest";
import { db } from "@/lib/firebase";
import { currentUser } from "@/lib/mock-data";
import type { Message, Room } from "@/lib/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

interface RoomPageProps {
  roomId: string;
}

export default function RoomPage({ roomId }: RoomPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomDoc = await getDoc(doc(db, "rooms", roomId));

        if (!roomDoc.exists()) {
          toast({
            title: "Room not found",
            description: "The room you're looking for doesn't exist.",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }

        const roomData = roomDoc.data();

        // Check if user is a member of this room
        if (!roomData.members.includes(currentUser.id)) {
          toast({
            title: "Access denied",
            description: "You don't have access to this room.",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }

        setRoom({
          id: roomDoc.id,
          name: roomData.name,
          createdAt: roomData.createdAt,
          createdBy: roomData.createdBy,
          members: roomData.members,
          isMainHall: roomData.isMainHall || false,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        toast({
          title: "Error",
          description: "Failed to load room data.",
          variant: "destructive",
        });
        router.push("/dashboard");
      }
    };

    fetchRoom();
  }, [roomId, router, toast]);

  // Subscribe to messages
  useEffect(() => {
    if (!roomId) return;

    const messagesQuery = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          roomId: roomId,
          content: data.content,
          createdAt: data.createdAt,
          sender: data.sender,
        });
      });
      setMessages(messagesData);

      // Scroll to bottom when new messages arrive
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Subscribe to video call status
  useEffect(() => {
    if (!roomId) return;

    const videoCallRef = doc(db, "videoCalls", roomId);

    const unsubscribe = onSnapshot(videoCallRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setIsVideoCallActive(data.active);
      } else {
        setIsVideoCallActive(false);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [isLoading, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !roomId) return;

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        content: messageInput.trim(),
        createdAt: serverTimestamp(),
        sender: {
          id: currentUser.id,
          name: currentUser.name,
          image: currentUser.image,
        },
      });

      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveRoom = async () => {
    if (!room || room.isMainHall) return;

    try {
      // Update room members by removing current user
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        members: room.members.filter((id) => id !== currentUser.id),
      });

      toast({
        title: "Left room",
        description: `You've left "${room.name}"`,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error leaving room:", error);
      toast({
        title: "Error",
        description: "Failed to leave room.",
        variant: "destructive",
      });
    }
  };

  const startVideoCall = async () => {
    if (!roomId) return;

    try {
      const videoCallRef = doc(db, "videoCalls", roomId);
      await setDoc(
        videoCallRef,
        {
          roomId,
          active: true,
          startedAt: serverTimestamp(),
          startedBy: currentUser.id,
          participants: [currentUser.id],
        },
        { merge: true },
      );

      setIsVideoCallActive(true);
    } catch (error) {
      console.error("Error starting video call:", error);
      toast({
        title: "Error",
        description: "Failed to start video call.",
        variant: "destructive",
      });
    }
  };

  const joinVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const endVideoCall = async () => {
    if (!roomId) return;

    try {
      const videoCallRef = doc(db, "videoCalls", roomId);
      await updateDoc(videoCallRef, {
        active: false,
      });

      setIsVideoCallActive(false);
    } catch (error) {
      console.error("Error ending video call:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Room not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col w-full h-full">
        {/* Room header */}
        <header className="flex justify-between items-center p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
            >
              <Icons.close className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">{room.name}</h1>
            {room.isMainHall && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                Main Hall
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isVideoCallActive ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={startVideoCall}
              >
                <Icons.video className="h-4 w-4" />
                Start Video Call
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
                onClick={endVideoCall}
              >
                <Icons.video className="h-4 w-4" />
                End Video Call
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsInviteOpen(true)}
            >
              <Icons.add className="h-4 w-4" />
              Invite
            </Button>
            {!room.isMainHall && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                onClick={handleLeaveRoom}
              >
                <Icons.logout className="h-4 w-4" />
                Leave
              </Button>
            )}
          </div>
        </header>

        {/* Video call area */}
        {isVideoCallActive && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800">
            <VideoCallTest roomId={roomId} onLeaveCall={endVideoCall} />
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Icons.chat className="h-12 w-12 mb-2 opacity-20" />
                <p>No messages yet</p>
                <p className="text-sm">Be the first to send a message!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.sender.id === currentUser.id ? "justify-end" : ""}`}
                >
                  {message.sender.id !== currentUser.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.image || ""} />
                      <AvatarFallback>
                        {message.sender.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      message.sender.id === currentUser.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.sender.id !== currentUser.id && (
                      <p className="text-xs font-medium mb-1">
                        {message.sender.name}
                      </p>
                    )}
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.sender.id === currentUser.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.image || ""} />
                      <AvatarFallback>
                        {currentUser.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <Separator />

          <form onSubmit={handleSendMessage} className="p-4">
            <div className="flex items-center gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" disabled={!messageInput.trim()}>
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      <InviteUserDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        roomId={roomId}
        currentMembers={room.members}
      />
    </div>
  );
}
