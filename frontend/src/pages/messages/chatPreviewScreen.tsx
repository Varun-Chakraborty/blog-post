import { ChatComponent } from './chatComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCreateOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { isGuestProfile, useAppDispatch, useAppSelector } from '@/lib/hooks';
import type { Profile } from '@/types/baseTypes';
import { cn } from '@/lib/utils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { chatActions } from '@/lib/redux/chat';
import { chatService, userService } from '@/services';

export function ChatPreviewScreen({
	className
}: Readonly<{
	className?: string;
}>) {
	const location = useLocation();
	const isItRoot = location.pathname.endsWith('/chat');
	const chats = useAppSelector(state => state.chat.chats);

	return (
		<div
			className={cn(
				'border-r lg:w-1/5 shrink-0 lg:block hidden',
				{ 'block w-full': isItRoot },
				className
			)}
		>
			<div className="flex justify-between border-b p-4">
				<div>Messages</div>
				<NewChatButton />
			</div>
			<div className="p-4 space-y-2 overflow-y-auto">
				{chats.map(chat => (
					<ChatComponent chat={chat} key={chat.chatId} />
				))}
			</div>
		</div>
	);
}

function NewChatButton({
	className
}: Readonly<{
	className?: string;
}>) {
	const navigate = useNavigate();
	const { profile } = useAppSelector(state => state.profile);
	const isItGuest = isGuestProfile();
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useAppDispatch();

	useEffect(() => {
		userService.getSuggestions(profile.username).then(res => setProfiles(res!));
	}, [isOpen]);

	async function createChat(username: string) {
		try {
			if (isItGuest) {
				toast('You must be logged in to create a chat');
				return;
			}
			const chatId = (await chatService.createChat(
				[profile.username, username],
				'CHAT'
			))!;
			const chat = await chatService.getChatPreviewById(chatId);
			dispatch(chatActions.appendChat({ newChat: chat! }));
			navigate(`/chat/${chatId}`);
		} catch (error) {
			if (isAxiosError(error)) toast('Failed to create chat');
			console.error(error);
		}
	}
	return (
		<Popover>
			<PopoverTrigger>
				<span className={className} onClick={() => setIsOpen(prev => !prev)}>
					<IoCreateOutline title="New Chat" />
				</span>
			</PopoverTrigger>
			<PopoverContent className="space-y-2">
				<p className="font-bold">
					You can start conversation with any of the following
				</p>
				<div>
					{profiles.map(profile => (
						<button
							key={profile.id}
							className="w-full hover:bg-primary/10 p-2 rounded-lg"
							onClick={() => createChat(profile.username)}
						>
							<div className="flex gap-2">
								<Avatar>
									<AvatarImage src="" />
									<AvatarFallback></AvatarFallback>
								</Avatar>
								<div className="w-full text-left">
									<div className="font-bold uppercase">{profile.name}</div>
									<div className="text-xs">@{profile.username}</div>
								</div>
							</div>
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
