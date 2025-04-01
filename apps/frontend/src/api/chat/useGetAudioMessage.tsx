import { api } from "@/config/client";
import { useQuery } from "@tanstack/react-query";

export const useGetAudioMessage = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["message", "audio", id],
    queryFn: () =>
      api
        .get(`/chat/message/audio/${id}`)
        .then((res) => res.data as Buffer<ArrayBuffer>),
    enabled: !!id,
  });
};
