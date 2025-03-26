import { useWebSocket } from "@/hooks/useWebSocket";
import { ISocketMessage, IUserStatus } from "@bitrock-town/types";
import { createContext, ReactNode, useContext, useState } from "react";

const WebSocketContext = createContext<{
  messages: ISocketMessage[];
  sendMessage: (message: ISocketMessage) => void;
  users: IUserStatus[];
  setUsers: (users: IUserStatus[]) => void;
} | null>(null);

export const WebSocketProvider = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => {
  const { messages, sendMessage } = useWebSocket(url);
  const [users, setUsers] = useState<IUserStatus[]>([]);

  return (
    <WebSocketContext.Provider
      value={{ messages, users, setUsers, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  return context;
};
