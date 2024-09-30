import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { FloatingMessage } from "./components/message";
import { Layout } from "./layout";
import { useProfile } from "./hooks/useProfile";

import {
  Home,
  Messages,
  Notifications,
  Dashboard,
  CreatePost,
  Search,
  NotFound,
  ShowPost,
  Settings,
  Profile,
  Login,
  Register,
  ForgotPassword,
} from "./pages";
import { ProtectedRoute } from "./components/protectedRoute";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "messages",
          element: <Messages />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "post/",
          children: [
            {
              path: "",
              element: <ShowPost />,
            },
            {
              path: "create",
              element: (
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "/signin",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Navigate to="/signin" />,
        },
        {
          path: "/register",
          element: <Navigate to="/signup" />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
      ],
    },
  ]);
  useProfile();
  return (
    <main className="h-screen w-screen flex justify-between">
      <RouterProvider router={router} />
      <FloatingMessage />
    </main>
  );
}
