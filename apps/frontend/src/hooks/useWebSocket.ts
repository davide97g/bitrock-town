import { useEffect, useState } from "react";

import { websocketService } from "@/services/webSocket.service";
import { ISocketMessage, IUserStatus } from "@bitrock-town/types";

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<ISocketMessage[]>([]);
  const [users, setUsers] = useState<IUserStatus[]>([]);

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
