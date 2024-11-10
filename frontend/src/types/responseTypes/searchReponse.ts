import { Post, Profile } from '../baseTypes';
import { APIResponse } from './baseResponse';

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
