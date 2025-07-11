import type { Post } from '@/types/baseTypes';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import {
	CommentButton,
	FollowButton,
	LikeButton,
	ShareButton
} from '@/components/buttons';
import { UserHoverCard } from '@/components/hoverCard';
import { useState } from 'react';
import { toast } from 'sonner';
import { handleLikePost } from '@/helperFunctions/likePost.ts';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { ParseMarkdown } from '@/components/parseMarkdown';

export function Post({
	post,
	className
}: Readonly<{ post: Post; className?: string }>) {
	const navigate = useNavigate();
	const [liked, setLiked] = useState(post.liked);
	const [likesCount, setLikesCount] = useState(post._count.likes);
	const { loggedIn } = useAppSelector(state => state.profile);
	const isFollowed =
		loggedIn.username === post.author.username || post.author.followed;

	return (
		<Card
			onClick={() => navigate(`/post/${post.id}`, { state: post })}
			className={cn(
				'w-full px-4 py-2 flex flex-col gap-2 border rounded-lg bg-transparent hover:bg-card space-y-2',
				className
			)}
		>
			<div className="flex justify-between p-2">
				<div className="flex gap-2">
					<Avatar>
						<AvatarImage
							src={post.author.profilePicture ?? '/placeholder-user.jpg'}
						/>
						<AvatarFallback>
							{post.author.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<HoverCard>
						<HoverCardTrigger asChild>
							<Button
								variant="link"
								className="text-sm text-gray-400 w-fit p-0 flex-col items-start gap-0"
								onClick={e => {
									e.stopPropagation();
									navigate(`/user/${post.author.username}`, {
										state: post.author
									});
								}}
							>
								<span className="font-semibold text-base">
									{post.author.name}
								</span>
								<span className="text-xs">@{post.author.username}</span>
							</Button>
						</HoverCardTrigger>
						<UserHoverCard user={post.author} />
					</HoverCard>
				</div>
				{!isFollowed && <FollowButton user={post.author} />}
			</div>
			<div className="text-xl font-bold">{post.title}</div>
			<div
				className={cn(
					'h-64 p-2 flex justify-center items-center',
					post.imgUrl || 'hidden'
				)}
			>
				<img src={post.imgUrl} alt="" className="h-full rounded" />
			</div>
			<div className={cn(post.imgUrl && 'hidden')}>
				<ParseMarkdown markdown={post.content} />
			</div>
			<div className="flex justify-between">
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
				<ShareButton shareCount={post._count.comments} onClick={() => {}} />
			</div>
		</Card>
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
