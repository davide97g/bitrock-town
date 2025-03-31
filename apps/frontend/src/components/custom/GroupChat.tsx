import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useEffect, useMemo, useRef, useState } from "react";

import { TouchEvent } from "react";

import { useDeleteChatMessage } from "@/api/chat/useDeleteChatMessage";
import { useGetChatMessages } from "@/api/chat/useGetChatMessages";
import { useSendChatMessage } from "@/api/chat/useSendChatMessage";
import { useGetUsers } from "@/api/user/useGetUsers";
import notificationSound from "@/assets/notification-sound.mp3";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/context/Auth/AuthProvider";
import {
  commonEmojis,
  formatTime,
  getInitials,
  getUserColor,
  isEmojiOnly,
  truncateText,
} from "@/services/utils";
import { IChatMessage } from "@bitrock-town/types";

import { useSendChatAudio } from "@/api/chat/useSendChatAudio";
import { Separator } from "@radix-ui/react-separator";
import {
  Copy,
  MoreHorizontal,
  Reply,
  SendIcon,
  Trash,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AudioPlayer } from "./Audio/AudioPlayer";
import { AudioRecorder } from "./Audio/AudioRecorder";
import { UserPreferencesModal } from "./Profile";

// const sound = new Audio(notificationSound);

const reproduceSound = () => {
  const audio = document.getElementById("myAudio") as HTMLAudioElement;
  if (audio) {
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }
};

export default function GroupChat({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string>();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const users = useGetUsers();

  const sendChatMessage = useSendChatMessage();
  const { data: oldMessages, refetch: refetchMessages } = useGetChatMessages();
  const deleteChatMessage = useDeleteChatMessage();
  const sendChatAudio = useSendChatAudio();

  const [newMessages, setNewMessages] = useState<IChatMessage[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const messages = useMemo(
    () =>
      oldMessages?.concat(newMessages).sort((a, b) => {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }),
    [oldMessages, newMessages]
  );

  useEffect(() => {
    console.log("attached to channel");
    const channel = supabase
      .channel("realtime:public:MESSAGES")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "MESSAGES" },
        (payload) => {
          console.log("Change received!", payload);
          setNewMessages((prev) => [...prev, payload.new as IChatMessage]);

          if (isSoundEnabled && payload.new.authorId !== user?.id)
            reproduceSound();
        }
      )
      .subscribe();

    return () => {
      console.log("detached from channel");
      channel.unsubscribe();
    };
  }, [isSoundEnabled, user?.id]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    sendChatMessage
      .mutateAsync({ message: input, replyToId: replyingTo })
      .then(() => {
        // Scroll to bottom after sending message
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]"
          );
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        }
      })
      .finally(() => {
        setInput("");
        setReplyingTo(undefined);
      });
  };

  const renderMessageContent = (content: string, type: string) => {
    if (type === "audio") return <AudioPlayer audioUrl={content} />;

    const isOnlyEmojis = isEmojiOnly(content);
    if (isOnlyEmojis)
      return <div className="text-3xl md:text-4xl">{content}</div>;

    return <div>{content}</div>;
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji);
    // Focus back on input after emoji selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle reply to message
  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle copy message
  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // Could show a toast notification here
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err);
      });
  };

  // Handle delete message (only for user's own messages)
  const handleDeleteMessage = (messageId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (confirmDelete) {
      deleteChatMessage
        .mutateAsync({ messageId })
        .then(() => refetchMessages().then(() => setNewMessages([])));
    }
  };

  // Find a message by ID
  const findMessageById = (id: string) => {
    return messages?.find((msg) => msg.id === id);
  };

  // Handle touch start for swipe detection
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Handle touch end for swipe detection
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>, messageId: string) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    // If swiped right more than 50px, trigger reply
    if (deltaX > 50) {
      handleReply(messageId);
    }

    setTouchStartX(null);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-3xl gap-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Bitrock Group Chat</CardTitle>
              <div className="flex items-center space-x-4">
                <audio id="myAudio">
                  <source src={notificationSound} type="audio/mpeg" />
                </audio>
                <Button onClick={() => setIsSoundEnabled((prev) => !prev)}>
                  {isSoundEnabled ? (
                    <Volume2Icon className="h-4 w-4" />
                  ) : (
                    <VolumeOffIcon className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex items-center space-x-2">
                  <UserPreferencesModal />
                </div>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh]" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.authorId === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    style={{
                      ...(message.authorId === "System" && {
                        justifyContent: "center",
                      }),
                    }}
                  >
                    {message.authorId === "System" ? (
                      <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {message.content}
                      </div>
                    ) : (
                      <div
                        className="flex items-start max-w-[80%] space-x-2 group"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={(e) => handleTouchEnd(e, message.id)}
                      >
                        {message.authorId !== user?.id && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage
                              src={
                                users.data?.find(
                                  (u) => u.id === message.authorId
                                )?.avatar_url
                              }
                              alt="Avatar"
                            />
                            <AvatarFallback
                              className={getUserColor(
                                users.data?.find(
                                  (u) => u.id === message.authorId
                                )?.name
                              )}
                            >
                              {getInitials(
                                users.data?.find(
                                  (u) => u.id === message.authorId
                                )?.name
                              )}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="relative">
                          {message.authorId !== user?.id && (
                            <div className="text-xs text-gray-500 mb-1">
                              {
                                users.data?.find(
                                  (u) => u.id === message.authorId
                                )?.name
                              }
                            </div>
                          )}

                          {/* Reply indicator */}
                          {message.replyToId && (
                            <div className="bg-gray-100 rounded p-2 mb-1 text-xs text-gray-600 border-l-2 border-gray-300">
                              <div className="font-medium">
                                Replying to{" "}
                                {users.data?.find(
                                  (u) =>
                                    u.id ===
                                    findMessageById(message.replyToId!)
                                      ?.authorId
                                )?.name || "deleted message"}
                              </div>
                              <div className="truncate">
                                {findMessageById(message.replyToId) &&
                                findMessageById(message.replyToId)?.type !==
                                  "audio"
                                  ? truncateText(
                                      findMessageById(message.replyToId)!
                                        .content
                                    )
                                  : "This message was deleted"}
                                {findMessageById(message.replyToId)?.type ===
                                  "audio" && "audio"}
                              </div>
                            </div>
                          )}

                          <div className="flex items-end space-x-1 relative">
                            <div
                              className={`p-3 rounded-lg relative ${
                                message.authorId === user?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {renderMessageContent(
                                message.content,
                                message.type
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.created_at)}
                            </span>
                            {/* Message actions on hover */}
                            <div
                              className={`absolute ${
                                message.authorId === user?.id
                                  ? "left-0 -translate-x-full"
                                  : "right-0 translate-x-full"
                              } top-0 hidden group-hover:flex items-center space-x-1 p-1`}
                            >
                              <button
                                onClick={() => handleReply(message.id)}
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                aria-label="Reply to message"
                              >
                                <Reply
                                  className="h-4 w-4 text-gray-600"
                                  style={{
                                    ...(message.authorId === user?.id && {
                                      transform: "scale(-1, 1)",
                                    }),
                                  }}
                                />
                              </button>
                              <div
                                style={{
                                  position: "relative",
                                }}
                              >
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                      <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    side="left"
                                    align="center"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => handleReply(message.id)}
                                    >
                                      <Reply className="h-4 w-4 mr-2" />
                                      <span>Reply</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleCopyMessage(message.content)
                                      }
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      <span>Copy</span>
                                    </DropdownMenuItem>
                                    {message.authorId === user?.id && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDeleteMessage(message.id)
                                        }
                                        className="text-red-500 focus:text-red-500"
                                      >
                                        <Trash className="h-4 w-4 mr-2" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicators */}
                {/* {typingIndicators.length > 0 && (
                  <div className="flex items-start space-x-2 animate-fade-in">
                    {typingIndicators.length === 1 ? (
                      <>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback
                            className={getUserColor(typingIndicators[0])}
                          >
                            {getInitials(typingIndicators[0])}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-1">
                          <span className="text-sm text-gray-500">
                            {typingIndicators[0]} is typing
                          </span>
                          <span className="flex space-x-1">
                            <span className="typing-dot bg-gray-400"></span>
                            <span className="typing-dot bg-gray-400 animation-delay-200"></span>
                            <span className="typing-dot bg-gray-400 animation-delay-400"></span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-1">
                        <span className="text-sm text-gray-500">
                          {typingIndicators.length} people are typing
                        </span>
                        <span className="flex space-x-1">
                          <span className="typing-dot bg-gray-400"></span>
                          <span className="typing-dot bg-gray-400 animation-delay-200"></span>
                          <span className="typing-dot bg-gray-400 animation-delay-400"></span>
                        </span>
                      </div>
                    )}
                  </div>
                )} */}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Reply indicator */}
          {replyingTo && (
            <div className="px-4 py-2 bg-gray-50 border-t border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Reply className="h-4 w-4 text-gray-500" />
                <div className="text-sm">
                  <span className="text-gray-500">Replying to </span>
                  <span className="font-medium">
                    {
                      users.data?.find(
                        (u) => u.id === findMessageById(replyingTo)?.authorId
                      )?.name
                    }
                  </span>
                  <span className="text-gray-500">: </span>
                  <span className="text-gray-600">
                    {findMessageById(replyingTo)
                      ? truncateText(findMessageById(replyingTo)!.content, 50)
                      : "This message was deleted"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReplyingTo(undefined)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cancel reply"
              >
                &times;
              </button>
            </div>
          )}
          <CardFooter className="border-t p-3">
            <div className="flex w-full space-x-2 flex-col">
              <div className="flex w-full space-x-2">
                {!isRecordingAudio && (
                  <>
                    <Input
                      value={input}
                      ref={inputRef}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow"
                      onKeyDown={(e) => {
                        // if (user?.id) onUserTyping(user?.id);
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <SendIcon />
                    </Button>
                  </>
                )}
                <AudioRecorder
                  onAudioReady={(audioBlob) => {
                    const formData = new FormData();
                    formData.append("file", audioBlob, "recording.webm");
                    setIsRecordingAudio(false);
                    sendChatAudio
                      .mutateAsync({
                        audio: formData,
                        replyToId: replyingTo,
                      })
                      .then(() => {
                        setInput("");
                        setReplyingTo(undefined);
                      })
                      .catch((error) => {
                        console.error("Error sending audio:", error);
                        toast.error("Error sending audio");
                      });
                  }}
                  onCancel={() => setIsRecordingAudio(false)}
                />
              </div>

              <div className="w-full">
                <Separator className="my-2" />
                <div className="text-xs text-gray-500 mb-2">Quick Emoji</div>
                <div className="w-full overflow-x-auto">
                  <div className="flex space-x-2 pb-2">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl hover:bg-gray-100 p-2 rounded-full transition-colors"
                        aria-label={`Emoji ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* CSS for typing animation */}
      <style>{`
        @keyframes typingAnimation {
          0% { opacity: 0.3; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.3; transform: translateY(0px); }
        }
        
        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          display: inline-block;
          animation: typingAnimation 1s infinite ease-in-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        /* Swipe hint animation */
        @keyframes swipeHint {
          0% { transform: translateX(0); }
          25% { transform: translateX(10px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        
        .swipe-hint {
          animation: swipeHint 2s ease-in-out;
        }
      `}</style>
    </>
  );
}
