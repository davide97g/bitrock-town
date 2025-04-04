import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { ServerReady } from "./components/custom/ServerReady.tsx";
import { AuthProvider } from "./context/Auth/AuthProvider.tsx";
import { LayoutProvider } from "./context/LayoutProvider.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import "./index.css";
import "./style.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="chat-theme">
      <LayoutProvider>
        <QueryClientProvider client={queryClient}>
          <ServerReady>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ServerReady>
        </QueryClientProvider>
      </LayoutProvider>
    </ThemeProvider>
  </StrictMode>
);
