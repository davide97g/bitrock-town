import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./context/Auth/AuthProvider";
import { KeyboardProvider } from "./context/KeyboardContext";
import { WebSocketProvider } from "./context/WebSocketProvider";
import { router } from "./router";
const { VITE_WS_SERVER_URL } = import.meta.env;

export default function App() {
  const { session } = useAuth();

  return (
    <WebSocketProvider
      url={`${VITE_WS_SERVER_URL}?token=${session?.access_token}`}
    >
      <KeyboardProvider>
        <RouterProvider router={router} />

        <Toaster />
      </KeyboardProvider>
    </WebSocketProvider>
  );
}
