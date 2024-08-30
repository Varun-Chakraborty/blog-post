import { Profile } from ".";

interface APIResponse {
  status: number;
  message: string;
  data?: any;
}

export type SearchResult = Profile;

export interface SearchResponse extends APIResponse {
  data?: {
    query: string;
    searchResult: SearchResult[];
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
