import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { ServerReady } from "./components/custom/ServerReady.tsx";
import { AuthProvider } from "./context/Auth/AuthProvider.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import "./index.css";
import "./style.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="chat-theme">
      <QueryClientProvider client={queryClient}>
        <ServerReady>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ServerReady>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
