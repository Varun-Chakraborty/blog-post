import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { MessageComponent } from './messageComponent';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@/lib/hooks';

function handleClickOutside(
	event: MouseEvent,
	currentComponent: React.RefObject<HTMLDivElement | null>,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>
) {
	if (
		currentComponent.current &&
		!currentComponent.current.contains(event.target as HTMLDivElement)
	) {
		setExpanded(false);
	}
}

export function FloatingMessage() {
	const [expanded, setExpanded] = useState(false);
	const [isChatCurrentPath, setIsChatCurrentPath] = useState(false);
	const currentComponent = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const unreadChats = useAppSelector(state => state.chat.unreadChats);

	useEffect(() => {
		const currentPath = location.pathname.split('/')[1];
		setIsChatCurrentPath(currentPath === 'chat');
	}, [location]);

	useEffect(() => {
		document.addEventListener('click', e =>
			handleClickOutside(e, currentComponent, setExpanded)
		);
		return () => {
			document.removeEventListener('click', e =>
				handleClickOutside(e, currentComponent, setExpanded)
			);
		};
	});

	return (
		<div
			ref={currentComponent}
			className={cn(
				'fixed bottom-0 right-3 sm:w-[25%] bg-background z-50 rounded-t-lg sm:block hidden select-none',
				{ 'sm:hidden': isChatCurrentPath }
			)}
		>
			<button
				className={cn(
					'flex justify-between items-center cursor-pointer p-3 rounded-t-lg w-full',
					{ 'border-b': expanded }
				)}
				onClick={() => setExpanded(!expanded)}
				type="button"
			>
				<div className="flex items-center gap-2">
					<span className="text-lg">Messages</span>
				</div>
				<div className="p-2 hover:bg-primary/10 rounded-full">
					<IoChevronDown
						className={cn('w-4 h-4 transition', expanded && 'rotate-180')}
					/>
				</div>
			</button>
			<div
				className={cn(
					'transition-all py-2 px-3 space-y-2',
					!expanded ? 'h-0' : 'h-fit'
				)}
			>
				{unreadChats.map(chat => (
					<MessageComponent
						chat={chat}
						key={chat.chatId}
						setExpanded={setExpanded}
					/>
				))}
			</div>
		</div>
	);
}
