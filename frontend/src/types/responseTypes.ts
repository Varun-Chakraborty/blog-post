import { Profile, Post, User } from ".";

interface APIResponse {
  status: number;
  message: string;
  data?: any;
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