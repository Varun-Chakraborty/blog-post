export * as ExpressTypes from './express';

export interface UserWithCredentials {
	id: string;
	name: string;
	username: string;
	role: 'USER' | 'ADMIN';
	isAdmin?: boolean;
	password: string;
	refreshToken?: string | null;
}
export interface Profile
	extends Omit<UserWithCredentials, 'password' | 'refreshToken'> {}

export interface User extends Profile {
	email: string;
	pfp?: string | null;
	banner?: string | null;
	posts?: Post[];
	postsCount?: number;
	followers?: { id: string }[];
	following?: { id: string }[];
	followersCount?: number;
	followingCount?: number;
}
export interface Post {
	id: string;
	title: string;
	content: string;
	author: Pick<User, 'username' | 'pfp'>;
}
export interface PostWithMeta extends Post {
	createdAt: string;
	updatedAt: string;
}
export interface AccessJWTResponse extends User {
	iat: number;
	exp: number;
}
export interface RefreshJWTResponse extends RefreshJWTPayload {
	iat: number;
	exp: number;
}
export interface RefreshJWTPayload extends Pick<Profile, 'id'> {}
