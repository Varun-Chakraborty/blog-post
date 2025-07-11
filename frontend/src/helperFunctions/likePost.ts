import type { Dispatch, SetStateAction } from 'react';
import type { Post } from '@/types/baseTypes.ts';
import { postService } from '@/services';
import { isAxiosError } from 'axios';

export async function handleLikePost(
	liked: boolean,
	setLiked: Dispatch<SetStateAction<boolean>>,
	setLikesCount: Dispatch<SetStateAction<number>>,
	post: Post,
	toast: (toast: any) => void
) {
	try {
		if (liked) {
			await postService.unLikePost(post!.id);
			setLiked(false);
			setLikesCount(prev => --prev);
		} else {
			await postService.likePost(post!.id);
			setLiked(true);
			setLikesCount(prev => ++prev);
		}
	} catch (error) {
		if (isAxiosError(error)) {
			toast(error.response?.data.message);
		}
		console.error(error);
	}
}
