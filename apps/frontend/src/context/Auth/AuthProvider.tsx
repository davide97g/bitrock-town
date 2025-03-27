import { api } from "@/config/client";
import { supabase } from "@/config/supabase";
import { getUserInfo, loginUser, logoutUser } from "@/services/api";
import { IUser } from "@bitrock-town/types";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

const AuthContext = createContext({
  user: null as IUser | null,
  login: (): Promise<void> => Promise.resolve(),
  logout: () => {},
  loading: true as boolean,
  isLogged: false as boolean,
  session: undefined as Session | undefined,
});

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);

  const token = useMemo(() => session?.access_token, [session]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session ?? undefined);
      try {
        if (session && !user)
          await getUserInfo({ token: session.access_token }).then((res) =>
            setUser(res)
          );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [user]);

  const login = async () => {
    return loginUser().then((res) => {
      if (!res) throw new Error("No token found");
      console.log("login", res);
    });
  };

  const logout = useCallback(() => {
    logoutUser();
  }, []);

  useEffect(() => {
    api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, [token]);

  useEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        toast.error("Uh oh! Something went wrong.");
        throw error;
      }
    );

    return () => {
      api.interceptors.response.eject(api.interceptors.response.use());
    };
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLogged: !!session,
      session,
      loading,
    }),
    [loading, logout, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};
