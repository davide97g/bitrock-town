import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/Auth/AuthProvider";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

export default function Login() {
  const { isLogged, login } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect after countdown
  useEffect(() => {
    if (!isLogged) return;
    const timer = setTimeout(() => {
      navigate("/");
    }, countdown * 1000);

    // Update countdown every second

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [countdown, isLogged, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {isLogged && (
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-orange-500" />
            </div>
          )}

          <div className="flex justify-center mb-4">
            <img className="h-16 w-16" src="logo.png" />
          </div>

          <CardTitle className="text-2xl">Login to bitrock.town</CardTitle>
        </CardHeader>

        <CardContent>
          {!isLogged ? (
            <p className="text-gray-500 mb-4">
              You need to login to access this page with your company Google
              account.
            </p>
          ) : (
            <div className="text-sm text-muted-foreground">
              Already logged. Redirecting to home in{" "}
              <span className="font-medium">{countdown}</span> seconds...
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {isLogged && (
            <Button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto cursor-pointer"
            >
              Home
            </Button>
          )}
          {!isLogged && (
            <Button onClick={login} className="w-full sm:w-auto cursor-pointer">
              Google Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
