import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { KeyboardProvider } from "./context/KeyboardContext";
import { router } from "./router";

export default function App() {
  return (
    <KeyboardProvider>
      <RouterProvider router={router} />
      <Toaster />
    </KeyboardProvider>
  );
}
