import Avatar from "@/components/custom/Avatar";
import OfficeItem from "@/components/custom/OfficeItem";
import { OnlineUsers } from "@/components/custom/OnlineUsers";
import { UserPreferencesModal } from "@/components/custom/Profile";
import { useAuth } from "@/context/Auth/AuthProvider";

import { useWebSocketContext } from "@/context/WebSocketProvider";

import GroupChat from "@/components/custom/GroupChat";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/context/LayoutProvider";
import { ISocketMessage } from "@bitrock-town/types";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  MessageCircleIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatInterface from "./AiChat";

// Office layout configuration
const officeItems = [
  { id: 1, type: "desk", x: 100, y: 150, width: 120, height: 60 },
  { id: 2, type: "desk", x: 300, y: 150, width: 120, height: 60 },
  { id: 3, type: "desk", x: 500, y: 150, width: 120, height: 60 },
  { id: 4, type: "desk", x: 100, y: 300, width: 120, height: 60 },
  { id: 5, type: "desk", x: 300, y: 300, width: 120, height: 60 },
  { id: 6, type: "desk", x: 500, y: 300, width: 120, height: 60 },
  { id: 7, type: "table", x: 300, y: 450, width: 150, height: 80 },
  { id: 8, type: "coffee", x: 600, y: 400, width: 50, height: 50 },
  { id: 9, type: "plant", x: 50, y: 50, width: 40, height: 40 },
  { id: 10, type: "plant", x: 550, y: 50, width: 40, height: 40 },
];

const VirtualSpace: React.FC = () => {
  const [position, setPosition] = useState({ x: 300, y: 200 });
  const [showControlHint, setShowControlHint] = useState(true);

  const spaceRef = useRef<HTMLDivElement>(null);
  const { session } = useAuth();
  const { messages, sendMessage, usersStatus } = useWebSocketContext();
  const { isMobile } = useLayout();

  const [showChat, setShowChat] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);

  useEffect(() => {
    // hide control hint after 2 seconds
    setTimeout(() => {
      setShowControlHint(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command+SHIFT+C (Mac) or Ctrl+SHIFT+C (Windows)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "c") {
        e.preventDefault();
        setShowChat((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const userPositions = useMemo(() => {
    return messages
      .filter(
        (message) =>
          message.event === "position" && message.senderId !== session?.user?.id
      )
      .filter((message) => message.data !== undefined);
  }, [messages, session?.user?.id]);

  const sendUserPosition = useCallback(
    (position: { x: number; y: number }) => {
      if (!session?.user.id) return;
      const newMessage: ISocketMessage = {
        event: "position",
        senderId: session?.user.id,
        data: {
          position,
        },
      };
      sendMessage(newMessage);
    },
    [sendMessage, session?.user.id]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // shift + arrow keys to move faster

      const shift = e.shiftKey ? 2 : 1;
      const step = 10 * shift;
      const newPosition = { ...position };

      switch (e.key) {
        case "ArrowUp":
          newPosition.y = Math.max(0, position.y - step);
          break;
        case "ArrowDown":
          newPosition.y = Math.min(
            spaceRef.current?.clientHeight || 600,
            position.y + step
          );
          break;
        case "ArrowLeft":
          newPosition.x = Math.max(0, position.x - step);
          break;
        case "ArrowRight":
          newPosition.x = Math.min(
            spaceRef.current?.clientWidth || 800,
            position.x + step
          );
          break;
        default:
          return;
      }

      // Check for collisions with office items
      const avatarSize = 40;
      const hasCollision = officeItems.some((item) => {
        return (
          newPosition.x < item.x + item.width &&
          newPosition.x + avatarSize > item.x &&
          newPosition.y < item.y + item.height &&
          newPosition.y + avatarSize > item.y
        );
      });

      if (!hasCollision) {
        setPosition(newPosition);
        sendUserPosition(newPosition);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, sendMessage, sendUserPosition]);

  const movePlayer = (direction: "up" | "down" | "left" | "right") => {
    const step = 10;
    const newPosition = { ...position };

    switch (direction) {
      case "up":
        newPosition.y = Math.max(0, position.y - step);
        break;
      case "down":
        newPosition.y = Math.min(
          spaceRef.current?.clientHeight || 600,
          position.y + step
        );
        break;
      case "left":
        newPosition.x = Math.max(0, position.x - step);
        break;
      case "right":
        newPosition.x = Math.min(
          spaceRef.current?.clientWidth || 800,
          position.x + step
        );
        break;
    }

    // Check for collisions with office items
    const avatarSize = 40;
    const hasCollision = officeItems.some((item) => {
      return (
        newPosition.x < item.x + item.width &&
        newPosition.x + avatarSize > item.x &&
        newPosition.y < item.y + item.height &&
        newPosition.y + avatarSize > item.y
      );
    });

    if (!hasCollision) {
      setPosition(newPosition);
      sendUserPosition(newPosition);
    }
  };

  return (
    <div className="app">
      <div className="virtual-space" ref={spaceRef}>
        <div className="office-background">
          {officeItems.map((item) => (
            <OfficeItem
              key={item.id}
              type={item.type}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
            />
          ))}
        </div>
        {userPositions.map((uP) => (
          <Avatar
            key={uP.senderId}
            username={uP.senderId ?? ""}
            x={uP.data.position.x}
            y={uP.data.position.y}
          >
            <img
              src={
                usersStatus.find((user) => user.id === uP.senderId)?.avatar_url
              }
              alt="avatar"
              className="rounded-full"
            />
          </Avatar>
        ))}
        <Avatar username="You" x={position.x} y={position.y}>
          <img
            src={session?.user.user_metadata.avatar_url}
            alt="avatar"
            className="rounded-full"
          />
        </Avatar>

        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <UserPreferencesModal />
        </div>
        {!isMobile && <OnlineUsers position="bottom-right" />}
      </div>
      {!showChat && (
        <div className="fixed bottom-0 left-0 right-0 h-[120px] p-4">
          <div className="mx-auto grid h-full w-full max-w-[200px] grid-cols-3 grid-rows-3 gap-1">
            {/* Empty top-left */}
            <div></div>

            {/* Up button */}
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => movePlayer("up")}
              aria-label="Move up"
            >
              <ArrowUp className="h-6 w-6" />
            </Button>

            {/* Empty top-right */}
            <div></div>

            {/* Left button */}
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => movePlayer("left")}
              aria-label="Move left"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>

            {/* Empty center */}
            <div></div>

            {/* Right button */}
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => movePlayer("right")}
              aria-label="Move right"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>

            {/* Empty bottom-left */}
            <div></div>

            {/* Down button */}
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => movePlayer("down")}
              aria-label="Move down"
            >
              <ArrowDown className="h-6 w-6" />
            </Button>

            {/* Empty bottom-right */}
            <div></div>
          </div>
        </div>
      )}
      <Button
        className="absolute bottom-2 left-2 cursor-pointer"
        onClick={() => setShowChat(true)}
      >
        <SparklesIcon />
      </Button>
      <Button
        className="absolute top-2 left-2 cursor-pointer"
        onClick={() => setShowGroupChat(true)}
      >
        <MessageCircleIcon />
      </Button>
      {showGroupChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <GroupChat onClose={() => setShowGroupChat(false)} />
        </div>
      )}
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
      {showControlHint && (
        <div className="controls-hint">
          <p>
            Use arrow keys to move. Press <kbd>Cmd</kbd>+<kbd>SHIFT</kbd>+
            <kbd>C</kbd> to chat with AI or click{" "}
            <span
              className="
         text-blue-500
         cursor-pointer
         hover:underline
         transition-colors
         duration-200
         ease-in-out
         "
              onClick={() => setShowChat(true)}
            >
              here
            </span>
            <XIcon
              className="h-4 w-4 inline-block ml-1 absolute bottom-1 right-1 cursor-pointer"
              onClick={() => setShowControlHint(false)}
            />
          </p>
        </div>
      )}
    </div>
  );
};

export default VirtualSpace;
