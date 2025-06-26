import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { AiOutlineMessage } from 'react-icons/ai';
import type { MouseEventHandler } from 'react';

export function Comment({
	commentsCount,
	onClick,
	className
}: Readonly<{
	commentsCount: number;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}>) {
	return (
		<Button
			onClick={e => {
				onClick?.(e);
			}}
			variant="outline"
			className={cn('p-0 hover:text-blue-500 rounded-full', className)}
		>
			<AiOutlineMessage />
			<span className="ml-2">{commentsCount}</span>
		</Button>
	);
}
