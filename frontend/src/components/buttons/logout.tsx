import { authService } from '@/services';
import { profileActions } from '@/lib/redux/profile';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/hooks';
import { isAxiosError } from 'axios';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface Props {
	setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
}

export function Logout({ setMenuOpen, className }: Readonly<Props>) {
	const dispatch = useAppDispatch();
	return (
		<Button
			onClick={async function () {
				try {
					await authService.logout();
					dispatch(profileActions.removeProfile());
					toast('Success');
				} catch (error) {
					if (isAxiosError(error) && error.response?.status === 401) {
						dispatch(profileActions.removeProfile());
						toast('Success');
						return;
					} else {
						toast('Error');
						console.error(error);
					}
				} finally {
					setMenuOpen(false);
				}
			}}
			variant="destructive"
			className={cn(
				'font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full',
				className
			)}
		>
			Logout
		</Button>
	);
}
