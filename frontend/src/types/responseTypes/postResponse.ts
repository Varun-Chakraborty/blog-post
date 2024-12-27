import { Comment, Post } from '../baseTypes';
import { APIResponse } from './baseResponse';

export interface GetPostsResponse extends APIResponse {
  data?: {
    posts: Post[];
  };
}

export interface GetPostResponse extends APIResponse {
  data?: {
    post: Post;
  };
}

export interface GetCommentsResponse extends APIResponse {
  data?: {
    comments: Comment[];
  };
}

export interface GetRepliesResponse extends APIResponse {
  data?: {
    replies: Comment[];
  };
}

export interface CreatePostResponse extends APIResponse {
  data?: {
    postId: string;
  };
}

export interface CreateCommentResponse extends APIResponse {
  data?: {
    comment: Comment;
  };
}

export interface CreateReplyResponse extends APIResponse {
  data?: {
    reply: Comment;
  };
}

export interface LikeResponse extends APIResponse {
  data?: {
    liked: boolean;
  };
}
