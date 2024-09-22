export * as ExpressTypes from './express';

export interface UserWithCredentials {
  id: string;
  name: string;
  username: string;
  isAdmin?: boolean;
  role: 'ADMIN' | 'USER';
  pfp?: string;
  email: string;
  password: string;
  refreshToken?: string;
}

export type User = Omit<
  UserWithCredentials,
  'email' | 'password' | 'refreshToken'
>;

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

export interface AccessJWTResponse extends User {
  iat: number;
  exp: number;
}
export interface RefreshJWTResponse extends RefreshJWTPayload {
  iat: number;
  exp: number;
}
export type RefreshJWTPayload = Pick<User, 'id'>;
