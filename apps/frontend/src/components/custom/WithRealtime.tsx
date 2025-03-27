import { useAuth } from "@/context/Auth/AuthProvider";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { ReactNode } from "react";

const { VITE_WS_SERVER_URL } = import.meta.env;

export function WithRealtime({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const url = `${VITE_WS_SERVER_URL}?token=${session?.access_token}`;
  return <WebSocketProvider url={url}>{children}</WebSocketProvider>;
}
