import { LoginButton, LogoutButton, ThemeButton } from '@/components/buttons';
import { isGuestProfile } from '@/lib/hooks';
import { cn } from '@/lib/utils';

interface Props {
	setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
}

export function Settings({ setMenuOpen, className }: Readonly<Props>) {
	const isItGuest = isGuestProfile();
	return (
		<div className={cn('w-full p-2 space-y-2', className)}>
			<ThemeButton />
			{isItGuest ? (
				<LoginButton setMenuOpen={setMenuOpen} />
			) : (
				<LogoutButton setMenuOpen={setMenuOpen} />
			)}
		</div>
	);
}
