import { api } from "@/config/client";
import { ICreateUser } from "@bitrock-town/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateUser() {
  return useMutation({
    mutationFn: ({ user }: { user: ICreateUser }) =>
      api.post("/user/create", user),
  });
}
