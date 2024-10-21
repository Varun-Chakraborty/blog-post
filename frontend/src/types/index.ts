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
  followers: number;
  following: number;
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
