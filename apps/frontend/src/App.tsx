import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { KeyboardProvider } from "./context/KeyboardContext";
import ChatInterface from "./pages/Chat";
import { router } from "./router";

export default function App() {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command+C (Mac) or Ctrl+C (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault();
        setShowChat((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <KeyboardProvider>
      <div className="app">
        <RouterProvider router={router} />
        {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
        <div className="controls-hint">
          <p>
            Use arrow keys to move. Press <kbd>Cmd</kbd>+<kbd>C</kbd> to chat
            with AI
          </p>
        </div>
      </div>
    </KeyboardProvider>
  );
}
