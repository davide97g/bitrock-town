import { useWebSocket } from "@/hooks/useWebSocket";
import { ISocketMessage } from "@bitrock-town/types";
import { createContext, ReactNode, useContext } from "react";

const WebSocketContext = createContext<{
  messages: ISocketMessage[];
  sendMessage: (message: ISocketMessage) => void;
} | null>(null);

export const WebSocketProvider = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => {
  const { messages, sendMessage } = useWebSocket(url);

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
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
