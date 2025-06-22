import { cn } from '@/lib/utils';
import { socketService } from '@/services';
import { useEffect, useState } from 'react';

export function NewMessageBubble({
	className
}: Readonly<{ className?: string }>) {
	const [isTyping, setIsTyping] = useState(false);
	useEffect(() => {
		socketService.onTyping(() => setIsTyping(true));
		socketService.onStoppedTyping(() => setIsTyping(false));
		return () => {
			socketService.offTyping();
			socketService.offStoppedTyping();
		};
	}, []);

	return (
		isTyping && (
			<div
				className={cn(
					'text-left relative w-fit border rounded-lg px-4 py-2 hover:bg-inherit/80 hover:dark:bg-inherit/80 flex gap-1',
					className
				)}
			>
				<div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500" />
				<div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500 delay-150" />
				<div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500 delay-300" />
			</div>
		)
	);
}
