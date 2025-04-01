import { api } from "@/config/client";
import { IUser } from "@bitrock/types";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.get("/user").then((res) => res.data as IUser),
    enabled: !!userId,
  });
};
