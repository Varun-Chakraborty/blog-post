export * as ExpressTypes from './express';

export interface User {
  id: string;
  name: string;
  username: string;
  isAdmin?: boolean;
  role: 'ADMIN' | 'USER';
  pfp?: string;
}

export interface UserWithMeta extends User {
  email: string;
  password: string;
  iat: number;
  exp: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
}

export interface PostWithMeta extends Post {
  createdAt: string;
  updatedAt: string;
}

export type AccessJWTResponse = User & {
  iat: number;
  exp: number;
};
export type RefreshJWTResponse = { id: string; iat: number; exp: number };
export type AccessJWTPayload = User & {
  password?: undefined;
  refreshToken?: undefined;
};
export type RefreshJWTPayload = { id: string };
