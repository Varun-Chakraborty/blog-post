export { Home } from './home';
export { Messages } from './messages';
export { Notifications } from './notifications';
export { Dashboard } from './dashboard';
export { CreatePost } from './createPost';
export { EditPost } from './editPost';
export { Search } from './search';
export { NotFound } from './notFound';
export { ShowPost } from './showPost';
export { ShowPosts } from './showPosts';
export { Settings } from './settings';
export { Profile } from './profile';
export { HandleErrors } from './handleErrors';

import {
	ForgotPasswordForm,
	LoginForm,
	RegisterForm
} from '@/components/forms';

export function Login() {
	return (
		<div className="h-full w-full flex justify-center items-center p-4">
			<LoginForm />
		</div>
	);
}

export function Register() {
	return (
		<div className="h-full w-full flex justify-center items-center p-4">
			<RegisterForm />
		</div>
	);
}

export function ForgotPassword() {
	return (
		<div className="h-full w-full flex justify-center items-center p-4">
			<ForgotPasswordForm />
		</div>
	);
}
