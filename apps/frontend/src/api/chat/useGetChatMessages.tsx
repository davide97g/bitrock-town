import { api } from "@/config/client";
import { IChatMessage } from "@bitrock/types";
import { useQuery } from "@tanstack/react-query";

export const useGetChatMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      api.get("/chat/messages").then((res) => res.data as IChatMessage[]),
  });
};
