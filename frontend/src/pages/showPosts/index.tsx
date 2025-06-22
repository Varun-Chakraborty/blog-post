import { NetworkError } from '@/components/networkError';
import { PostsDisplay } from '@/components/postsDisplay';
import { toast } from 'sonner';
import { postService } from '@/services';
import type { Post } from '@/types/baseTypes';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

export function ShowPosts({ className }: Readonly<{ className?: string }>) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isNetworkError, setIsNetworkError] = useState<boolean>(false);

	useEffect(() => {
		postService
			.getPosts()
			.then(res => {
				setIsLoading(false);
				setPosts(res!);
			})
			.catch(e => {
				setIsLoading(false);
				if (isAxiosError(e)) {
					toast('Error');
				} else {
					if (e.message === 'Network Error') {
						setIsNetworkError(true);
					}
				}
				console.error(e);
			});
	}, []);

	const netWorkError = isNetworkError ? <NetworkError /> : null;

	return (
		netWorkError ?? (
			<div className="p-6 h-full">
				<PostsDisplay
					posts={posts}
					isLoading={isLoading}
					className={className}
				/>
			</div>
		)
	);
}
