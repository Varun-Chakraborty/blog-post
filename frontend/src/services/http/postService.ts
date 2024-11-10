import { APIResponseTypes } from '@/types';
import { HTTPService } from './httpService';

class PostService extends HTTPService {
  constructor() {
    super();
  }

  async getPosts() {
    const response =
      await this.api.get<APIResponseTypes.GetPostsResponse>('/post');
    return response.data.data?.posts;
  }

  async getPostsByUsername(username: string) {
    const response = await this.api.get<APIResponseTypes.GetPostsResponse>(
      `/user/${username}/posts`
    );
    return response.data.data?.posts;
  }

  async getPostById(postId: string) {
    const response = await this.api.get<APIResponseTypes.GetPostResponse>(
      `/post/${postId}`
    );
    return response.data.data?.post;
  }

  async getCommentsByPostId(postId: string) {
    const response = await this.api.get<APIResponseTypes.GetCommentsResponse>(
      `/post/${postId}/comments`
    );
    return response.data.data?.comments;
  }

  async getRepliesByCommentId(commentId: string) {
    const response = await this.api.get<APIResponseTypes.GetRepliesResponse>(
      `/comment/${commentId}/replies`
    );
    return response.data.data?.replies;
  }

  async createComment(message: string, postId: string) {
    const response =
      await this.api.post<APIResponseTypes.CreateCommentResponse>(
        `/post/${postId}/comment`,
        {
          message
        }
      );
    return response.data.data?.comment;
  }

  async createReply(message: string, commentId: string) {
    const response = await this.api.post<APIResponseTypes.CreateReplyResponse>(
      `/comment/${commentId}/reply`,
      {
        message
      }
    );
    return response.data.data?.reply;
  }

  async likePost(postId: string) {
    const response = await this.api.post<APIResponseTypes.LikeResponse>(
      `/post/${postId}/like`
    );
    return response.data.data?.liked;
  }

  async likeComment(commentId: string) {
    const response = await this.api.post<APIResponseTypes.LikeResponse>(
      `/comment/${commentId}/like`
    );
    return response.data.data?.liked;
  }

  async likeReply(replyId: string) {
    const response = await this.api.post<APIResponseTypes.LikeResponse>(
      `/reply/${replyId}/like`
    );
    return response.data.data?.liked;
  }

  async unLikePost(postId: string) {
    const response = await this.api.delete<APIResponseTypes.LikeResponse>(
      `/post/${postId}/like`
    );
    return response.data.data?.liked;
  }

  async unLikeComment(commentId: string) {
    const response = await this.api.delete<APIResponseTypes.LikeResponse>(
      `/comment/${commentId}/like`
    );
    return response.data.data?.liked;
  }

  async unLikeReply(replyId: string) {
    const response = await this.api.delete<APIResponseTypes.LikeResponse>(
      `/reply/${replyId}/like`
    );
    return response.data.data?.liked;
  }

  async deletePost(postId: string) {
    const response = await this.api.delete<APIResponseTypes.APIResponse>(
      `/post/${postId}`
    );
    return response.data;
  }
}

export default new PostService();
