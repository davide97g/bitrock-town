import { Login } from "@/components/custom/Login";
import { api } from "@/config/client";
import { loginUser } from "@/services/api";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "./auth.context";
import { extractInfoFromToken } from "./utils";

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("bitrock-town-token")
  );

  const user = useMemo(() => extractInfoFromToken(token), [token]);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    return loginUser({
      username,
      password,
    }).then((res) => {
      const { token } = res;
      setToken(token);
      localStorage.setItem("bitrock-town-token", token);
    });
  };

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("bitrock-town-token");
    window.location.reload();
  }, []);

  useEffect(() => {
    const tokenInfo = extractInfoFromToken(token);
    if (tokenInfo) {
      const now = Date.now().valueOf() / 1000;
      if (now >= tokenInfo.exp) {
        logout();
      }
    }
  }, [token, logout]);

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
  }, [token, toast]);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [logout, token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {token ? children : <Login />}
    </AuthContext.Provider>
  );
}
