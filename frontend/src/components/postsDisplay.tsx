import { PostCard, PostCardSkeleton } from '@/components/cards';
import { cn } from '@/lib/utils';
import type { Post } from '@/types/baseTypes';
import { Button } from './ui/button';

export function PostsDisplay({
	posts,
	isLoading,
	loadMore,
	className
}: Readonly<{
	posts: Post[];
	isLoading: boolean;
	loadMore?: () => void;
	className?: string;
}>) {
	return (
		<>
			{!isLoading && posts.length === 0 ? (
				<div className="h-full w-full flex justify-center items-center font-bold uppercase text-xl">
					No posts found
				</div>
			) : (
				<>
					<div
						className={cn(
							'h-fit w-full flex flex-col gap-4 overflow-y-auto',
							className
						)}
					>
						{posts.map(post => (
							<PostCard key={post.id} post={post} />
						))}
						{isLoading &&
							[...Array(7)].map((_, i) => <PostCardSkeleton key={i} />)}
					</div>
					{loadMore && (
						<Button variant="outline" className="w-full" onClick={loadMore}>
							Load more
						</Button>
					)}
				</>
			)}
		</>
	);
}
