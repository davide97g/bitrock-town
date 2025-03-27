import { useAuth } from "@/context/Auth/AuthProvider";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export default function Login() {
  const { isLogged, login } = useAuth();

  if (isLogged) return <p>You are already logged in</p>;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        // Prevent closing the dialog if no username is set
        if (!open) {
          return;
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Please login with your Google account</DialogTitle>
          <div className="grid gap-4 py-4 w-6 h-6">
            <Button onClick={login}>Google Login</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
