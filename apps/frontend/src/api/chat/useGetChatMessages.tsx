import { api } from "@/config/client";
import { useQuery } from "@tanstack/react-query";

export const useGetChatMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: () => api.get("/chat/messages"),
  });
};
