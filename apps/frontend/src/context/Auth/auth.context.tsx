import { IUser } from "@bitrock-town/types";
import { createContext } from "react";
import { Session } from "@supabase/supabase-js";

export const AuthContext = createContext({
  user: null as IUser | null,
  login: (): Promise<void> => Promise.resolve(),
  logout: () => {},
  loading: true as boolean,
  isLogged: false as boolean,
  session: undefined as Session | undefined,
});
