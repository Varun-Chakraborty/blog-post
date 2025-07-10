import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import type { MouseEventHandler } from 'react';

interface Props {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}

export function Login({ onClick, className }: Readonly<Props>) {
	const navigate = useNavigate();
	return (
		<Button
			onClick={e => {
				navigate(`/auth/signin?next=`);
				onClick?.(e);
			}}
			variant="accent"
			className={cn('uppercase rounded-full', className)}
		>
			Login
		</Button>
	);
}
