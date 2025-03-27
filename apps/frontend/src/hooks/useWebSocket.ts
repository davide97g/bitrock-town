import { useEffect, useState } from "react";

import { useGetUsers } from "@/api/user/useGetUsers";
import { websocketService } from "@/services/webSocket.service";
import { ISocketMessage, IUserStatus } from "@bitrock-town/types";

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<ISocketMessage[]>([]);
  const { data: users, refetch } = useGetUsers();

  const [usersStatus, setUsersStatus] = useState<IUserStatus[]>([]);

  useEffect(() => {
    messages.forEach((message) => {
      const userIndex = users?.findIndex(
        (user) => user.id === message.senderId,
      );
      if (userIndex === -1 || userIndex === undefined) {
        refetch();
        return;
      }
      if (usersStatus.length === 0) {
        setUsersStatus(
          users?.map(
            (user) =>
              ({
                ...user,
                status: "offline",
                lastUpdated: Date.now(),
              }) as IUserStatus,
          ) ?? [],
        );
        return;
      }
      usersStatus[userIndex].lastUpdated = Date.now();
      usersStatus[userIndex].status = "online";
      setUsersStatus([...usersStatus]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

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

  return { messages, sendMessage, usersStatus, setUsersStatus };
};
