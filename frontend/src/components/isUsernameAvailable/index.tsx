import { MdCheck } from 'react-icons/md';
import { Loader } from '../loader';
import { RxCross1 } from 'react-icons/rx';
import { cn } from '@/lib/utils';
import { userService } from '@/services';
import { useEffect, useState } from 'react';
import type { UseFormSetError, UseFormTrigger } from 'react-hook-form';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

interface Props {
	trigger: UseFormTrigger<{
		name: string;
		username: string;
		email: string;
		password: string;
	}>;
	setError: UseFormSetError<{
		name: string;
		username: string;
		email: string;
		password: string;
	}>;
	username: string;
	className?: string;
}

export function IsUsernameAvailable({
	trigger,
	setError,
	username,
	className
}: Readonly<Props>) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isUsernameAvailable, setIsUsernameAvailable] = useState<
		boolean | undefined
	>(true);

	const renderLoader = isLoading ? <Loader /> : null;
	const renderUsernameAvailable =
		isUsernameAvailable !== undefined ? (
			<>
				{isUsernameAvailable ? (
					<MdCheck
						className={cn('text-success', {
							hidden: !isUsernameAvailable
						})}
					/>
				) : (
					<RxCross1
						className={cn('text-error', {
							hidden: !isUsernameAvailable
						})}
					/>
				)}
			</>
		) : null;

	useEffect(() => {
		setIsLoading(true);
		let timeout: NodeJS.Timeout | undefined;
		timeout = setTimeout(() => {
			(async function () {
				try {
					if (!username) return setIsUsernameAvailable(undefined);
					const isValid = await trigger('username');
					if (!isValid) return setIsUsernameAvailable(undefined);
					else {
						const isAvailable = await userService.isUsernameAvailable(username);
						setIsUsernameAvailable(isAvailable);
						if (!isAvailable)
							setError('username', { message: 'Not Available' });
					}
				} finally {
					setIsLoading(false);
				}
			})();
		}, 1000);
		return () => timeout && clearTimeout(timeout);
	}, [username]);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<div className={cn('h-4 rounded-full pl-2', className)}>
						{renderLoader ?? renderUsernameAvailable}
					</div>
				</TooltipTrigger>
				<TooltipContent className="right-0">
					{isUsernameAvailable ? 'Available' : 'Not Available'}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
