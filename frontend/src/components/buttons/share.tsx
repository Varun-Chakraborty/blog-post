import type { MouseEventHandler } from 'react';
import { Button } from '../ui/button';
import { IoIosSend } from 'react-icons/io';
import { cn } from '@/lib/utils';

export function Share({
	shareCount,
	onClick,
	className
}: Readonly<{
	shareCount: number;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}>) {
	return (
		<Button
			onClick={e => {
				e.preventDefault();
				onClick?.(e);
			}}
			variant="outline"
			className={cn('p-0 hover:text-green-500 rounded-full', className)}
		>
			<IoIosSend />
		</Button>
	);
}
