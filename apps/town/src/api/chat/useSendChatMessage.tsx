import { api } from "@/config/client";
import { useMutation } from "@tanstack/react-query";

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: ({
      message,
      replyToId,
    }: {
      message: string;
      replyToId?: string;
    }) => api.post("/chat/message", { message, replyToId }),
  });
};
