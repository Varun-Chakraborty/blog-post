import { isAxiosError } from 'axios';
import { HTTPService } from './httpService';
import {
	BaseResponseTypes,
	PostResponseTypes,
	UserResponseTypes
} from '@/types/responseTypes';

class UserService extends HTTPService {
	constructor() {
		super();
	}

	async getProfileSummary(username: string) {
		const response =
			await this.api.get<UserResponseTypes.GetProfileSummaryResponse>(
				`/user/${username}/profile/summary`
			);
		return response.data.data?.profileSummary;
	}

	async getProfile(username: string) {
		const response = await this.api.get<UserResponseTypes.GetProfileResponse>(
			`/user/${username}/profile`
		);
		return response.data.data?.user;
	}

	async isUsernameAvailable(username: string) {
		try {
			await this.api.get(`/isUsernameAvailable?username=${username}`);
			return true;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 409) {
				return false;
			} else {
				throw error;
			}
		}
	}

	async followUser(username: string) {
		const response = await this.api.post<UserResponseTypes.FollowUserResponse>(
			`/user/${username}/follow`
		);
		return response.data;
	}

	async unfollowUser(username: string) {
		const response = await this.api.post<BaseResponseTypes.APIResponse>(
			`/user/${username}/unfollow`
		);
		return response.data;
	}

	async getFollowers(username: string) {
		const response = await this.api.get<UserResponseTypes.GetFollowersResponse>(
			`/user/${username}/followers`
		);
		return response.data.data?.followers;
	}

	async getFollowing(username: string) {
		const response = await this.api.get<UserResponseTypes.GetFollowingResponse>(
			`/user/${username}/following`
		);
		return response.data.data?.following;
	}

	async getIfFollowedByCurrentUser(username: string) {
		try {
			await this.api.get(`/user/${username}/isFollowedByUser`);
			return true;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return false;
			} else {
				throw error;
			}
		}
	}

	async getSuggestions() {
		const response =
			await this.api.get<UserResponseTypes.GetSuggestionsResponse>(
				`/user/suggestions`
			);
		return response.data.data?.suggestions;
	}

	async getPostsByUsername(username: string) {
		const response = await this.api.get<PostResponseTypes.GetPostsResponse>(
			`/user/${username}/posts`
		);
		return response.data.data?.posts;
	}

	async getMyLikedPosts() {
		const response = await this.api.get<PostResponseTypes.GetPostsResponse>(
			'/user/me/likedPosts'
		);
		return response.data.data?.posts;
	}
}

export default new UserService();
