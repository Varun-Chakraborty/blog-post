import { BaseResponseTypes, PostResponseTypes } from '@/types/responseTypes';
import { HTTPService } from './httpService';

class PostService extends HTTPService {
	constructor() {
		super();
	}

	async getPosts() {
		const response =
			await this.api.get<PostResponseTypes.GetPostsResponse>('/post');
		return response.data.data?.posts;
	}

	async getPostsByUsername(username: string) {
		const response = await this.api.get<PostResponseTypes.GetPostsResponse>(
			`/post/user/${username}`
		);
		return response.data.data?.posts;
	}

	async getPostById(postId: string) {
		const response = await this.api.get<PostResponseTypes.GetPostResponse>(
			`/post/${postId}`
		);
		return response.data.data?.post;
	}

	async getCommentsByPostId(postId: string) {
		const response = await this.api.get<PostResponseTypes.GetCommentsResponse>(
			`/post/${postId}/comments`
		);
		return response.data.data?.comments;
	}

	async getRepliesByCommentId(commentId: string) {
		const response = await this.api.get<PostResponseTypes.GetRepliesResponse>(
			`/comment/${commentId}/replies`
		);
		return response.data.data?.replies;
	}

	async createPost(data: { title: string; content: string; imageUrl: string }) {
		return (
			await this.api.post<PostResponseTypes.CreatePostResponse>('/post', data)
		).data.data?.postId;
	}

	async updatePost(
		postId: string,
		data: { title: string; content: string; imageUrl: string }
	) {
		return (
			await this.api.put<PostResponseTypes.CreatePostResponse>(
				`/post/${postId}`,
				data
			)
		).data.data?.postId;
	}

	async createComment(message: string, postId: string) {
		const response =
			await this.api.post<PostResponseTypes.CreateCommentResponse>(
				`/post/${postId}/comment`,
				{
					message
				}
			);
		return response.data.data?.comment;
	}

	async createReply(message: string, commentId: string) {
		const response = await this.api.post<PostResponseTypes.CreateReplyResponse>(
			`/comment/${commentId}/reply`,
			{
				message
			}
		);
		return response.data.data?.reply;
	}

	async deleteComment(commentId: string) {
		const response = await this.api.delete<BaseResponseTypes.APIResponse>(
			`/comment/${commentId}`
		);
		return response.data;
	}

	async likePost(postId: string) {
		const response = await this.api.post<PostResponseTypes.LikeResponse>(
			`/post/${postId}/like`
		);
		return response.data.data?.liked;
	}

	async likeComment(commentId: string) {
		const response = await this.api.post<PostResponseTypes.LikeResponse>(
			`/comment/${commentId}/like`
		);
		return response.data.data?.liked;
	}

	async likeReply(replyId: string) {
		const response = await this.api.post<PostResponseTypes.LikeResponse>(
			`/reply/${replyId}/like`
		);
		return response.data.data?.liked;
	}

	async unLikePost(postId: string) {
		const response = await this.api.delete<PostResponseTypes.LikeResponse>(
			`/post/${postId}/like`
		);
		return response.data.data?.liked;
	}

	async unLikeComment(commentId: string) {
		const response = await this.api.delete<PostResponseTypes.LikeResponse>(
			`/comment/${commentId}/like`
		);
		return response.data.data?.liked;
	}

	async unLikeReply(replyId: string) {
		const response = await this.api.delete<PostResponseTypes.LikeResponse>(
			`/reply/${replyId}/like`
		);
		return response.data.data?.liked;
	}

	async deletePost(postId: string) {
		const response = await this.api.delete<BaseResponseTypes.APIResponse>(
			`/post/${postId}`
		);
		return response.data;
	}
}

export default new PostService();
