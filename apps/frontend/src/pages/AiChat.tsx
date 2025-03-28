import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Auth/AuthProvider";

import { useSendMessage } from "@/api/ai/useSendMessage";
import { ChatMessage } from "@/components/custom/ChatMessage";
import { Send, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

export default function ChatInterface({ onClose }: { onClose: () => void }) {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendAiMessage = useSendMessage();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create a temporary message for the assistant's response
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, content: "", role: "assistant" },
    ]);

    try {
      // Send request to backend
      if (!session) throw new Error("No token available");
      const response = await sendAiMessage.mutateAsync(input);

      if (!response) {
        throw new Error("Failed to fetch response");
      }

      // Update the assistant message with the response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: response.data }
            : msg
        )
      );
    } catch (error) {
      console.error("Error:", error);
      // Update the assistant message with an error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Sorry, there was an error processing your request.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="min-h-screen min-w-screen shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <img className="h-12 w-12" src="logo.png" />
            Bitrock AI
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="destructive" onClick={onClose}>
                <XIcon />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow-1 max-h-[75vh] overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              loading={
                messages.filter((m) => m.role === "assistant").length - 1 ===
                  index && isLoading
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
