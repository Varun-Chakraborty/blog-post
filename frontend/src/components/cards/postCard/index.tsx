import type { Post } from '@/types/baseTypes';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { CommentButton, LikeButton } from '@/components/buttons';
import { UserHoverCard } from '@/components/hoverCard';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { postService } from '@/services';
import { toast } from 'sonner';
import { handleLikePost } from '@/helperFunctions/likePost.ts';

export function Card({ post }: Readonly<{ post: Post }>) {
	const navigate = useNavigate();
	const [liked, setLiked] = useState(post.liked);
	const [likesCount, setLikesCount] = useState(post._count.likes);

	return (
		<div
			onClick={() => navigate(`/post/${post.id}`)}
			className="h-fit w-full p-2 flex flex-col gap-2 border rounded-lg"
		>
			{post.imgUrl && (
				<div className="h-56 rounded overflow-clip">
					<img
						src={post.imgUrl}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
			)}
			<div className="text-left space-y-1">
				<div className="text-xl font-bold">{post.title}</div>
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button
							variant="link"
							className="p-0 h-5"
							onClick={e => {
								e.stopPropagation();
								navigate(`/user/${post.author.username}`);
							}}
						>
							@{post.author.username}
						</Button>
					</HoverCardTrigger>
					<UserHoverCard user={post.author} />
				</HoverCard>
			</div>
			<div className="flex gap-2">
				<LikeButton
					liked={liked}
					likesCount={likesCount}
					onClick={async e => {
						e.stopPropagation();
						await handleLikePost(liked, setLiked, setLikesCount, post, toast);
					}}
				/>
				<CommentButton
					commentsCount={post._count.comments}
					onClick={() => {}}
				/>
			</div>
		</div>
	);
}

export function CardSkeleton() {
	return (
		<div className="h-fit w-full p-2 flex flex-col gap-2">
			<Skeleton className="h-56 w-full rounded" />
			<div className="space-y-1">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-3 w-3/4" />
			</div>
			<div className="flex gap-2">
				{[...Array(3)].map((_, i) => (
					<Skeleton className="h-8 w-8" key={i} />
				))}
			</div>
		</div>
	);
}
