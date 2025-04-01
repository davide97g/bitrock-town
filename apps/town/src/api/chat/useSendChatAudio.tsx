import { api } from "@/config/client";
import { useMutation } from "@tanstack/react-query";

export const useSendChatAudio = () => {
  return useMutation({
    mutationFn: ({
      audio,
      replyToId,
    }: {
      audio: FormData;
      replyToId?: string;
    }) =>
      api.post("/chat/message/audio", audio, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          replyToId,
        },
      }),
    mutationKey: ["sendChatAudio"],
  });
};
