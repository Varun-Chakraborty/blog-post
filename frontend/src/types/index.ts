export type * as APIResponseTypes from "./responseTypes";

export interface Profile {
    'id': string;
    'name': string;
    'username': string;
    'email': string;
    'role': 'USER' | 'ADMIN';
    'pfp'?: string;
    'guest'?: boolean;
}