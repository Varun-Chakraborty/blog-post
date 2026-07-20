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
	EditPost,
	Search,
	NotFound,
	ShowPost,
	Settings,
	Profile,
	HandleErrors,
	Auth,
} from './pages';
import { ProtectedRoute } from './components/protectedRoute';
import { ThemeProvider } from './lib/context/themeContext';
import {
	LoginForm,
	RegisterForm,
	ForgotPasswordForm
} from '@/components/forms';

export default function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			Component: Layout,
			children: [
				{
					path: '(/|topics/:topic|trending)',
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
							element: <Navigate to="/" />
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
						},
						{
							path: ':id/edit',
							Component: EditPost
						}
					]
				},
				{
					path: 'login',
					element: <Navigate to="/auth/signin" />
				},
				{
					path: 'register',
					element: <Navigate to="/auth/signup" />
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
					path: '*',
					Component: NotFound
				},
			],
			ErrorBoundary: HandleErrors
		},
		{
			path: 'auth',
			Component: Auth,
			children: [
				{
					path: 'forgot-password',
					Component: ForgotPasswordForm
				},
				{
					path: 'signin',
					Component: LoginForm
				},
				{
					path: 'signup',
					Component: RegisterForm
				}
			]
		}
	]);
	return (
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}
