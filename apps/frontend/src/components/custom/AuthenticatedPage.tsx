import { useAuth } from "@/context/Auth/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader } from "./Loader";

export function AuthenticatedPage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { loading, isLogged, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!isLogged) navigate("/login");
    else if (isLogged && !user) {
      console.error("User is logged in but no user data found");
      navigate("/register");
    }
  }, [isLogged, loading, navigate, user]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {loading && <Loader />}
      {!loading && isLogged && children}
    </div>
  );
}
