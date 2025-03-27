import { useAuth } from "@/context/Auth/AuthProvider";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { ReactNode } from "react";
import { Loader } from "./Loader";

const { VITE_WS_SERVER_URL } = import.meta.env;

export function WithRealtime({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const url = `${VITE_WS_SERVER_URL}?token=${session?.access_token}`;
  return (
    <WebSocketProvider url={url}>
      {!user ? <Loader /> : children}
    </WebSocketProvider>
  );
}
