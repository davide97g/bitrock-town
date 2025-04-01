import { useGetUsers } from "@/api/user/useGetUsers";
import { websocketService } from "@/services/webSocket.service";
import { ISocketMessage, IUserStatus } from "@bitrock/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./Auth/AuthProvider";

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
  const { user } = useAuth();
  const { data: users, refetch } = useGetUsers();

  const [usersStatus, setUsersStatus] = useState<IUserStatus[]>([]);

  const updateUserStatus = useCallback(
    (userId: string) => {
      setUsersStatus((prevUsers) => {
        const userStatus = prevUsers.find((user) => user.id === userId);
        if (userStatus)
          return prevUsers.map((user) =>
            user.id === userId
              ? { ...user, status: "online", lastUpdated: Date.now() }
              : user,
          );
        const user = users?.find((user) => user.id === userId);
        if (user)
          return [
            ...prevUsers,
            { ...user, status: "online", lastUpdated: Date.now() },
          ];
        else refetch();
        return prevUsers;
      });
    },
    [refetch, users],
  );

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
        if (user?.id === message.senderId) return prevMessages;
        const msgIndex = prevMessages.findIndex(
          (msg) => msg.senderId === message.senderId,
        );
        updateUserStatus(message.senderId);
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
  }, [updateUserStatus, url, user?.id]);

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
