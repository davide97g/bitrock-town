import { Login } from "@/components/custom/Login";
import { api } from "@/config/client";
import { supabase } from "@/config/supabase";
import { getUserInfo, loginUser } from "@/services/api";
import { Session } from "@supabase/supabase-js";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "./auth.context";

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>();

  // const user = useMemo(() => extractInfoFromToken(token), [token]);

  const token = useMemo(() => session?.access_token, [session]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      console.log({ session });

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
    localStorage.removeItem("bitrock-town-token");
    window.location.reload();
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

  return (
    <AuthContext.Provider value={value}>
      {token ? children : <Login />}
    </AuthContext.Provider>
  );
}
