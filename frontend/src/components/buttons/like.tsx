import { useEffect, useState, type MouseEventHandler } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';

export function Like({
	liked,
	likesCount,
	onClick,
	className
}: Readonly<{
	liked: boolean;
	likesCount: number;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}>) {
	const [likedState, setLikedState] = useState(liked);
	useEffect(() => setLikedState(liked), [liked]);
	return (
		<Button
			onClick={e => {
				e.stopPropagation();
				onClick?.(e);
			}}
			className={cn('p-0 hover:text-red-500 rounded-full', className)}
			variant="outline"
		>
			{likedState ? <IoHeartSharp /> : <IoHeartOutline />}
			<span className="ml-2">{likesCount}</span>
		</Button>
	);
}
