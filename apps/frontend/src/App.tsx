import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./context/Auth/AuthProvider";
import { KeyboardProvider } from "./context/KeyboardContext";
import { WebSocketProvider } from "./context/WebSocketProvider";
import ChatInterface from "./pages/Chat";
import { router } from "./router";
const { VITE_WS_SERVER_URL } = import.meta.env;

export default function App() {
  const [showChat, setShowChat] = useState(false);

  const { session } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command+SHIFT+C (Mac) or Ctrl+SHIFT+C (Windows)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "c") {
        e.preventDefault();
        setShowChat((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <WebSocketProvider
      url={`${VITE_WS_SERVER_URL}?token=${session?.access_token}`}
    >
      <KeyboardProvider>
        <div className="app">
          <RouterProvider router={router} />
          {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
          <div className="controls-hint">
            <p>
              Use arrow keys to move. Press <kbd>Cmd</kbd>+<kbd>SHIFT</kbd>+
              <kbd>C</kbd> to chat with AI or click{" "}
              <span
                className="
              text-blue-500
              cursor-pointer
              hover:underline
              transition-colors
              duration-200
              ease-in-out
              "
                onClick={() => setShowChat(true)}
              >
                here
              </span>
            </p>
          </div>
        </div>
        <Toaster />
      </KeyboardProvider>
    </WebSocketProvider>
  );
}
