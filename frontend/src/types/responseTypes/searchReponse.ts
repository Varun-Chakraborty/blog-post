import type { Post, Profile } from '../baseTypes';
import type { APIResponse } from './baseResponse';

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
