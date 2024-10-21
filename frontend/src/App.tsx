import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import { Layout } from './layout';
import { useProfile } from './hooks/useProfile';

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
  HandleErrors
} from './pages';
import { ProtectedRoute } from './components/protectedRoute';
import { ChatScreen } from './components/chatScreen';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        {
          path: '',
          Component: Home
        },
        {
          path: 'chat',
          Component: Messages,
          children: [
            {
              path: '*',
              Component: ChatScreen
            }
          ]
        },
        {
          path: 'notifications',
          Component: Notifications
        },
        {
          path: 'dashboard',
          Component: Dashboard
        },
        {
          path: 'search',
          Component: Search
        },
        {
          path: 'post/',
          children: [
            {
              path: '',
              Component: ShowPost
            },
            {
              path: 'create',
              element: (
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: '*',
          Component: NotFound
        },
        {
          path: 'signin',
          Component: Login
        },
        {
          path: 'signup',
          Component: Register
        },
        {
          path: 'login',
          element: <Navigate to="/signin" />
        },
        {
          path: 'register',
          element: <Navigate to="/signup" />
        },
        {
          path: 'settings',
          Component: Settings
        },
        {
          path: 'user',
          children: [
            {
              path: '*',
              Component: Profile
            }
          ]
        },
        {
          path: 'forgot-password',
          Component: ForgotPassword
        }
      ],
      ErrorBoundary: HandleErrors
    }
  ]);
  useProfile();
  return (
    <main className="h-screen w-screen flex justify-between">
      <RouterProvider router={router} />
    </main>
  );
}
