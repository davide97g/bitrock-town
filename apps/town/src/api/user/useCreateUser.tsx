import { api } from "@/config/client";
import { ICreateUser } from "@bitrock/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateUser() {
  return useMutation({
    mutationFn: ({ user }: { user: ICreateUser }) => api.post("/user", user),
  });
}
