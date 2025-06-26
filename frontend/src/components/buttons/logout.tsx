import { authService } from '@/services';
import { profileActions } from '@/lib/redux/profile';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/hooks';
import { isAxiosError } from 'axios';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import type { MouseEventHandler } from 'react';

interface Props {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}

export function Logout({ onClick, className }: Readonly<Props>) {
	const dispatch = useAppDispatch();
	return (
		<Button
			onClick={async function (e) {
				try {
					await authService.logout();
					dispatch(profileActions.logout());
					toast('Success');
				} catch (error) {
					if (isAxiosError(error) && error.response?.status === 401) {
						dispatch(profileActions.logout());
						toast('Success');
						return;
					} else {
						toast('Error');
						console.error(error);
					}
				} finally {
					onClick?.(e);
				}
			}}
			variant="destructive"
			className={cn('uppercase rounded-full', className)}
		>
			Logout
		</Button>
	);
}
