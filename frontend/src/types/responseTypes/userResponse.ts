import type { Profile, User } from '../baseTypes';
import type { APIResponse } from './baseResponse';

export interface GetProfileSummaryResponse extends APIResponse {
	data?: {
		profileSummary: Profile;
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

export interface GetSuggestionsResponse extends APIResponse {
	data?: {
		suggestions: Profile[];
	};
}
