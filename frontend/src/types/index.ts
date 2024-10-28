export type * as APIResponseTypes from './responseTypes';

export interface Profile {
  id: string;
  name: string;
  username: string;
  role?: 'USER' | 'ADMIN';
  pfp?: string | null;
  guest?: boolean;
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
  content: string;
  author: Profile;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  chatId: string;
  message: string;
  sentBy: string;
  updatedAt: string;
}

export interface ChatPreview {
  id: string;
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
  updatedAt: string;
}
