import type { Chat, ChatPreview } from '../baseTypes';
import type { APIResponse } from './baseResponse';

export interface CreateChatResponse extends APIResponse {
	data?: {
		chatId: string;
	};
}

export interface GetChatPreviewsResponse extends APIResponse {
	data?: {
		chatPreviews: ChatPreview[];
	};
}

export interface GetUnreadChatsResponse extends APIResponse {
	data?: {
		unreadChats: ChatPreview[];
	};
}

export interface GetChatByIdResponse extends APIResponse {
	data?: {
		chat: Chat;
	};
}

export interface GetChatPreviewByIdResponse extends APIResponse {
	data?: {
		chatPreview: ChatPreview;
	};
}
