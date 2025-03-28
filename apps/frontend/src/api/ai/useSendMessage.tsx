import { api } from "@/config/client";
import { useMutation } from "@tanstack/react-query";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (message: string) => api.post("/ai/message", { message }),
  });
};
