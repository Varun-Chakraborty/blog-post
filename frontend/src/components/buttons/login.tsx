import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import type { MouseEventHandler } from 'react';

interface Props {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}

export function Login({ onClick, className }: Readonly<Props>) {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<Button
			onClick={e => {
				navigate(`/auth/signin?next=${location.pathname}`);
				onClick?.(e);
			}}
			variant="accent"
			className={cn('uppercase rounded-full', className)}
		>
			Login
		</Button>
	);
}
