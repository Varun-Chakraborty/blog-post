export interface Profile {
	id: string;
	name: string;
	username: string;
	role?: 'USER' | 'ADMIN';
	profilePicture?: string | null;
	isGuest?: boolean;
	createdAt: string;
}

export interface User extends Omit<Profile, 'guest'> {
	banner?: string;
	bio: string;
	followersCount: number;
	followingCount: number;
	posts: Post[];
}

export interface Post {
	id: string;
	title: string;
	content?: string;
	author: Profile & { followed: boolean };
	imgUrl?: string;
	liked: boolean;
	_count: {
		comments: number;
		likes: number;
	};
	createdAt?: string;
}

export interface Comment {
	id: string;
	content: string;
	author: Profile;
	authorId: string;
	_count: {
		replies: number;
		likes: number;
	};
	liked: boolean;
	updatedAt: Date;
}

export interface Message {
	id: string;
	chatId: string;
	content: string;
	author: Profile;
	updatedAt: string;
}

export interface ChatPreview {
	chatId: string;
	type: 'CHAT' | 'GROUP';
	groupName?: string;
	pfp?: string;
	participants: Profile[];
	latestMessage: Message;
	updatedAt: string;
}

export interface Chat {
	id: string;
	type: 'CHAT' | 'GROUP';
	groupName?: string;
	pfp?: string;
	participants: Profile[];
	messages: Message[];
	groupedMessages: { [key: string]: Message[] };
	updatedAt: string;
}
