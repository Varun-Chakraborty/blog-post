import express from 'express';
import { Profile } from '..';

export interface Req extends express.Request {
	body: {
		email?: string;
		name?: string;
		password?: string;
		username?: string;
		participants?: string[];
		groupName?: string;
		type?: 'CHAT' | 'GROUP';
		message?: string;
		title?: string;
		content?: string;
		imageUrl?: string;
	};
	query: {
		query?: string;
		searchFor?: string;
		username?: string;
		skip?: string;
		take?: string;
	};
	params: {
		username?: string;
		chatId?: string;
		postId?: string;
		commentId?: string;
	};
	cookies: {
		accessToken?: string;
		refreshToken?: string;
	};
	tokens?: {
		accessToken?: string;
		refreshToken?: string;
	};
	user?: Profile;
}
export interface Res extends express.Response {}
export interface Next extends express.NextFunction {}
