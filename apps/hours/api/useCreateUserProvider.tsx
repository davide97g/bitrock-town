import { useAuth } from "@/app/(auth)/AuthProvider";
import { ICreateUser, IUser } from "@bitrock/types";

export function useCreateUserProvider() {
  const { session } = useAuth();
  const createUser = ({ user }: { user: ICreateUser }) =>
    fetch("/user/provider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => data as IUser);

  return { createUser };
}
