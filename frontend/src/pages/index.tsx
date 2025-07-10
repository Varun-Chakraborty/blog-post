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
import { Outlet } from 'react-router-dom';

export function Auth() {
	return (
		<main className="h-svh w-screen flex justify-center items-center p-4">
			<Outlet />
		</main>
	);
}
