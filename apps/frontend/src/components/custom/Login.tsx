import { useAuth } from "@/context/Auth/AuthProvider";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function Login() {
  const { isLogged, login } = useAuth();

  if (isLogged) return null;

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
          <DialogTitle>Enter your username</DialogTitle>
          <div className="grid gap-4 py-4 w-6 h-6">
            <Button onClick={login}>Login</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
