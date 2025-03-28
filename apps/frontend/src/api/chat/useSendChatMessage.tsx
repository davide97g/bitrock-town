import { api } from "@/config/client";
import { useMutation } from "@tanstack/react-query";

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: (message: string) => api.post("/chat/message", { message }),
  });
};
