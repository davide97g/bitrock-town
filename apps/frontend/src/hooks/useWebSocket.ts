import { useEffect, useState } from "react";

import { websocketService } from "@/services/webSocket.service";
import { ISocketMessage, IUserStatus } from "@bitrock-town/types";

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<ISocketMessage[]>([]);
  const [users, setUsers] = useState<IUserStatus[]>([]);

  useEffect(() => {
    if (!messages.length) setUsers([]);
    messages.forEach((message) => {
      const userIndex = users.findIndex((user) => user.id === message.data?.id);
      const newUser: IUserStatus = {
        id: message.data?.id ?? "",
        username: message.data?.username ?? "",
        status: "online",
        lastUpdated: Date.now(),
      };

      if (userIndex !== -1) {
        setUsers((prevUsers) => {
          prevUsers[userIndex] = newUser;
          return [...prevUsers];
        });
      } else setUsers((prevUsers) => [...prevUsers, newUser]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          Date.now() - user.lastUpdated > 5000
            ? { ...user, status: "offline" }
            : user
        )
      );
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    websocketService.connect(url);

    websocketService.setOnMessageCallback((message: ISocketMessage) => {
      setMessages((prevMessages) => {
        const msgIndex = prevMessages.findIndex(
          (msg) => msg.data?.id === message.data?.id
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

  return { messages, sendMessage, users, setUsers };
};
