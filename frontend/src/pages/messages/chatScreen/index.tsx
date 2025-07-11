import { chatService, socketService } from '@/services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import type { Chat } from '@/types/baseTypes';
import { useEffect, useState } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MessageBubble } from './messageBubble';
import { NewMessage } from './newMessageForm';
import { NewMessageBubble } from './newMessageBubble';
import { chatActions } from '@/lib/redux/chat';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export function ChatScreen({
	className
}: Readonly<{
	className?: string;
}>) {
	const [chat, setChat] = useState<Chat | undefined>();
	const [isItGroup, setIsItGroup] = useState(false);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { chatId } = useParams();
	const { loggedIn } = useAppSelector(state => state.profile);

	const location = useLocation();
	const isItRoot = location.pathname.endsWith('/chat');

	useEffect(() => {
		if (!chatId) return;
		chatService
			.getChatById(chatId)
			.then(chat => {
				setChat(chat);
				if (chat) {
					setIsItGroup(chat.type === 'GROUP');
					dispatch(chatActions.popUnreadChat({ id: chatId }));
				}
			})
			.catch(e => {
				if (isAxiosError(e)) {
					if (e.response?.status === 404) {
						dispatch(chatActions.popChat({ id: chatId }));
						dispatch(chatActions.popUnreadChat({ id: chatId }));
						toast('Chat not found');
						navigate('/chat');
					}
				}
				console.error(e);
			});
	}, [chatId]);

	socketService.onNewMessage(async function (data) {
		if (data.chatId === chatId) {
			setChat(prev => {
				if (prev) {
					const today = data.message.updatedAt.split('T')[0];
					if (prev.groupedMessages[today]) {
						prev.groupedMessages[today] = prev.groupedMessages[today].filter(
							messages => messages.id !== data.message.id
						);
					} else {
						prev.groupedMessages[today] = [];
					}
					prev.groupedMessages[today].push(data.message);
					return { ...prev };
				}
			});
		}
	});

	const renderNoChatMessage = !chatId ? (
		<div
			className={cn(
				'w-full flex justify-center items-center text-2xl',
				{ 'hidden lg:flex': isItRoot },
				className
			)}
		>
			No chat selected yet
		</div>
	) : null;

	return (
		renderNoChatMessage ?? (
			<div className={cn('w-full flex flex-col', className)}>
				<div className="px-2 flex justify-between w-full border-b p-2">
					<button
						onClick={() => navigate('/chat')}
						className="hover:bg-primary/10 rounded-full aspect-square flex justify-center items-center"
					>
						<HiArrowLeft />
					</button>
					<button
						onClick={() =>
							isItGroup ||
							navigate(
								`/user/${chat!.participants.find(p => p.username !== loggedIn.username)!.username}`
							)
						}
						className="flex gap-2 items-center hover:bg-primary/10 px-2 py-1 rounded-lg"
					>
						<Avatar>
							<AvatarImage
								src={
									(chat?.pfp ?? isItGroup)
										? '/placeholder-user.jpg'
										: '/placeholder-user.jpg'
								}
							/>
							<AvatarFallback>
								{isItGroup
									? chat?.participants.find(
											p => p.username !== loggedIn.username
										)?.name
									: chat?.groupName}
							</AvatarFallback>
						</Avatar>
						<span className={cn({ uppercase: isItGroup })}>
							{!isItGroup
								? chat?.participants
										.find(p => p.username !== loggedIn.username)!
										.name.toUpperCase()
								: chat?.groupName}
						</span>
					</button>
					<div />
				</div>
				<div className="h-full overflow-y-auto flex flex-col justify-end gap-3 p-4">
					{Object.keys(chat?.groupedMessages ?? []).map(date => (
						<>
							<div
								key={date}
								className="mx-auto px-2 p-1 rounded-lg bg-secondary text-primary-foreground"
							>
								{new Date().getDate() - new Date(date).getDate() > 1
									? new Date(date).toLocaleDateString(undefined, {
											dateStyle: 'medium'
										})
									: new Date().getDate() - new Date(date).getDate() === 1
										? 'Yesterday'
										: 'Today'}
							</div>
							{chat!.groupedMessages[date].map(message => (
								<MessageBubble
									message={message}
									key={message.id}
									isItGroup={isItGroup}
								/>
							))}
						</>
					))}
					<NewMessageBubble />
				</div>
				<NewMessage chatId={chat?.id} setChat={setChat} className="border-t" />
			</div>
		)
	);
}
