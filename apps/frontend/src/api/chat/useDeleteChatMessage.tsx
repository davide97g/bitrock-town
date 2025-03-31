import { api } from "@/config/client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteChatMessage = () => {
  return useMutation({
    mutationFn: ({ messageId }: { messageId: string }) =>
      api.delete(`/chat/message/${messageId}`),
  });
};
