import { ISocketMessage } from "@bitrock-town/types";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../Auth/useAuth";
import { SocketContext } from "./socket.context";

const { VITE_WS_SERVER_URL } = import.meta.env;

export function SocketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { token, user } = useAuth();

  const [socket, setSocket] = useState<WebSocket>();

  const startSocketConnection = useCallback(() => {
    if (!socket || !token) return;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      // fetch users positions in the map
    };

    socket.onmessage = (event) => {
      const socketMessage = JSON.parse(event.data) as ISocketMessage;

      console.log("Received message:", socketMessage);
      const message = socketMessage.data;
      if (!message) return;
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [socket, token, user?.username]);

  useEffect(() => {
    if (!token) socket?.close();
    if (!socket) {
      console.info("Creating new WebSocket connection");
      setSocket(new WebSocket(`${VITE_WS_SERVER_URL}?token=${token}`));
      return;
    }
    startSocketConnection();
  }, [socket, startSocketConnection, token]);

  const value = useMemo(() => ({}), []);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
