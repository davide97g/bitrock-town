import { useGetUsers } from "@/api/user/useGetUsers";
import { websocketService } from "@/services/webSocket.service";
import { ISocketMessage, IUserStatus } from "@bitrock-town/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const WebSocketContext = createContext<{
  messages: ISocketMessage[];
  sendMessage: (message: ISocketMessage) => void;
  usersStatus: IUserStatus[];
  setUsersStatus: (users: IUserStatus[]) => void;
} | null>(null);

export const WebSocketProvider = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => {
  const [messages, setMessages] = useState<ISocketMessage[]>([]);
  const { data: users } = useGetUsers();

  const [usersStatus, setUsersStatus] = useState<IUserStatus[]>([]);

  useEffect(() => {
    const userFound = messages.map((m) => {
      const u = users?.find((u) => u.id === m.senderId);
      return u;
    });
    setUsersStatus(userFound as IUserStatus[]);
  }, [messages, users]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsersStatus((prevUsers) =>
        prevUsers.map((user) =>
          Date.now() - user.lastUpdated > 5000
            ? { ...user, status: "offline" }
            : user,
        ),
      );
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    websocketService.connect(url);

    websocketService.setOnMessageCallback((message: ISocketMessage) => {
      setMessages((prevMessages) => {
        const msgIndex = prevMessages.findIndex(
          (msg) => msg.senderId === message.senderId,
        );
        if (msgIndex !== -1) {
          prevMessages[msgIndex] = message;
          return [...prevMessages];
        }
        return [...prevMessages, message];
      });
    });

    return () => {
      websocketService.setOnMessageCallback(() => {}); // Cleanup callback
    };
  }, [url]);

  const sendMessage = (message: ISocketMessage) => {
    websocketService.sendMessage(message);
  };

  return (
    <WebSocketContext.Provider
      value={{ messages, usersStatus, setUsersStatus, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  return context;
};
