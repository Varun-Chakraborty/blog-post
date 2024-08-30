export * as ExpressTypes from './express';

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
    pfp?: string;
}


export type AccessJWTResponse = User & { password: undefined, iat: number, exp: number };
export type RefreshJWTResponse = { id: string, iat: number, exp: number };
export type AccessJWTPayload = User & { password: undefined };
export type RefreshJWTPayload = { id: string };