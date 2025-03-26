import { api } from "@/config/client";
import { useAuth } from "@/context/Auth/useAuth";
import { IUser } from "@bitrock-town/types";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => api.get("/user").then((res) => res.data as IUser),
    enabled: !!user?.id,
  });
};
