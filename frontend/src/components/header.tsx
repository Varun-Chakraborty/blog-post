import { Logo } from '@/components/logo';
import { SearchBar } from '@/components/searchBar';
import { LoginButton, LogoutButton, ThemeButton } from '@/components/buttons';
import { NotificationButton } from '@/components/buttons';
import { useAppSelector } from '@/lib/hooks';

export function Header() {
	const isGuest = useAppSelector(state => state.profile.loggedIn.isGuest);
	return (
		<header className="flex justify-between p-2">
			<Logo className="shrink-0 w-fit md:w-1/4" />
			<div className="w-full justify-center items-center md:flex hidden">
				<SearchBar />
			</div>
			<div className="flex gap-3 items-center shrink-0 w-fit md:w-1/4 justify-end">
				<NotificationButton className="hidden md:block" />
				<ThemeButton />
				{isGuest ? <LoginButton /> : <LogoutButton />}
			</div>
		</header>
	);
}
