import { api } from "@/config/client";
import { IUser } from "@bitrock/types";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data as IUser[]),
  });
};
