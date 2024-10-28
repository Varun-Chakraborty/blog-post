import { Profile, Post, User, Chat, ChatPreview } from '.';

export interface APIResponse {
  status: number;
  message: string;
  data?: any;
}

export interface ErrorResponse extends APIResponse {
  status: number;
  message: string;
}

export interface SearchResult {
  users: Profile[];
  posts: Post[];
}

export interface SearchResponse extends APIResponse {
  data?: {
    query: string;
    searchResult: SearchResult;
  };
}

export interface LoginResponse extends APIResponse {
  data?: {
    user: Profile;
    accessToken: string;
  };
}

export interface SignupResponse extends APIResponse {
  data?: {
    user: Profile;
    accessToken: string;
  };
}

export interface GetProfileResponse extends APIResponse {
  data?: {
    user?: User;
  };
}

export interface FollowUserResponse extends APIResponse {
  data?: {
    user: User;
  };
}

export interface GetFollowersResponse extends APIResponse {
  data?: {
    followers: Profile[];
  };
}

export interface GetFollowingResponse extends APIResponse {
  data?: {
    following: Profile[];
  };
}

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
    chat: ChatPreview;
  };
}
