import { useCreateUser } from "@/api/user/useCreateUser";
import { Loader } from "@/components/custom/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/Auth/AuthProvider";
import { UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function RegisterPage() {
  const [showRecap, setShowRecap] = useState(false);

  const navigate = useNavigate();
  const { session, user, loading } = useAuth();
  const sessionUser = session?.user.user_metadata;

  const createUser = useCreateUser();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRecap(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createUser
      .mutateAsync({
        user: {
          name: sessionUser?.name,
          email: sessionUser?.email,
          avatar_url: sessionUser?.avatar_url,
        },
      })
      .then(() => {
        // Here you would typically send the data to your backend
        toast.success("Registration completed successfully");
      });
  };

  const handleBack = () => {
    setShowRecap(false);
  };

  if (!session && !loading) {
    console.info("User not logged in", session);
    navigate("/login");
    return null;
  }

  if (user && !loading) {
    console.info("User already registered", user);
    navigate("/");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      {loading ? (
        <Loader />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {showRecap ? "Review Your Information" : "Create Your Account"}
            </CardTitle>
            <CardDescription>
              {showRecap
                ? "Please review your information before completing registration"
                : "Fill in your details to get started"}
            </CardDescription>
          </CardHeader>

          {!showRecap ? (
            <form onSubmit={handleContinue} className="gap-4 flex flex-col">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={sessionUser?.name}
                    disabled
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={sessionUser?.email}
                    disabled
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Profile Image URL</Label>
                  <Input id="imageUrl" value={sessionUser?.avatar_url} />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </CardFooter>
            </form>
          ) : (
            <>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={sessionUser?.avatar_url}
                      alt={sessionUser?.name}
                    />
                    <AvatarFallback className="text-4xl">
                      <UserCircle className="h-20 w-20" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Name:
                    </div>
                    <div className="col-span-2 font-medium">
                      {sessionUser?.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Email:
                    </div>
                    <div className="col-span-2 font-medium">
                      {sessionUser?.email}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>Complete Registration</Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
