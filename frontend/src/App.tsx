import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import { Layout } from './layout';

import {
  Home,
  Messages,
  Notifications,
  Dashboard,
  CreatePost,
  Search,
  NotFound,
  ShowPost,
  ShowPosts,
  Settings,
  Profile,
  Login,
  Register,
  ForgotPassword,
  HandleErrors
} from './pages';
import { ProtectedRoute } from './components/protectedRoute';

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
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          )
        },
        {
          path: 'chat/:chatId',
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          )
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
          path: 'post',
          children: [
            {
              path: '',
              Component: ShowPosts
            },
            {
              path: 'create',
              element: (
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              )
            },
            {
              path: ':id',
              Component: ShowPost
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
              path: ':username',
              Component: Profile,
              children: [
                {
                  path: ':section',
                  Component: Profile
                }
              ]
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
  return (
    <main className="h-screen w-screen flex justify-between">
      <RouterProvider router={router} />
    </main>
  );
}
