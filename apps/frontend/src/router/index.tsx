import { AuthenticatedPage } from "@/components/custom/AuthenticatedPage";
import { Loader } from "@/components/custom/Loader";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

const SystemStats = lazy(() => import("../pages/SystemStats"));
const VirtualSpace = lazy(() => import("../pages/VirtualSpace"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthenticatedPage>
          <VirtualSpace />
        </AuthenticatedPage>
      </Suspense>
    ),
    loader: Loader,
  },
  {
    path: "/login",
    element: <Login />,
    loader: Loader,
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthenticatedPage>
          <Register />
        </AuthenticatedPage>
      </Suspense>
    ),
    loader: Loader,
  },
  {
    path: "/stats",
    element: <SystemStats />,
    loader: Loader,
  },
  {
    path: "/*",
    Component: NotFound,
    loader: Loader,
  },
]);
