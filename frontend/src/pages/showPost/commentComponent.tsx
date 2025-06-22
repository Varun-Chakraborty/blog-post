import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { LikeButton } from '@/components/buttons';
import { UserHoverCard } from '@/components/hoverCard';
import type { Comment } from '@/types/baseTypes';
import { useAppSelector } from '@/lib/hooks';
import { postService } from '@/services';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CiMenuKebab } from 'react-icons/ci';

export function CommentComponent({
	comment,
	setComments,
	setShowReplies,
	className
}: Readonly<{
	comment: Comment;
	setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
	setShowReplies?: React.Dispatch<React.SetStateAction<boolean>>;
	type: 'COMMENT' | 'REPLY';
	className?: string;
}>) {
	const { profile } = useAppSelector(state => state.profile);
	const [likesCount, setLikesCount] = useState(comment._count.likes ?? 0);
	const [liked, setLiked] = useState(comment.liked);
	return (
		<button
			onClick={() => setShowReplies?.(prev => !prev)}
			className={cn(
				'flex justify-between items-center hover:bg-muted dark:hover:bg-muted/10 cursor-pointer p-2 rounded-lg text-left w-full',
				className
			)}
		>
			<div className="flex gap-2 items-center">
				<Avatar>
					<AvatarImage
						src={comment.author.profilePicture ?? '/placeholder-user.jpg'}
					/>
					<AvatarFallback>
						{comment.author.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div>
					<div className="flex gap-2 items-center">
						<HoverCard>
							<HoverCardTrigger asChild>
								<Button variant="link" className="p-0 h-5">
									@{comment.author.username}
								</Button>
							</HoverCardTrigger>
							<UserHoverCard user={comment.author} />
						</HoverCard>
						<div className="text-muted-foreground text-sm flex gap-2 items-center">
							<div>
								{new Date(comment.updatedAt).toLocaleDateString(undefined, {
									year: 'numeric',
									month: 'long'
								})}
							</div>
						</div>
					</div>
					<div>{comment.content}</div>
				</div>
			</div>
			<div className="flex gap-4 items-center">
				<LikeButton
					liked={liked}
					onClick={async e => {
						e.stopPropagation();
						try {
							if (liked) {
								await postService.unLikeComment(comment.id);
								setLikesCount(prev => --prev);
								setLiked(false);
							} else {
								await postService.likeComment(comment.id);
								setLikesCount(prev => ++prev);
								setLiked(true);
							}
						} catch (error) {
							if (isAxiosError(error)) {
								toast('Error');
							}
							console.error(error);
						}
					}}
					likesCount={likesCount}
				/>
				{profile?.id === comment.author.id && (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<CiMenuKebab size={24} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuLabel>Actions on Comment</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>Edit Comment</DropdownMenuItem>
									<DropdownMenuItem
										onClick={async () => {
											await postService.deleteComment(comment.id);
											setComments(prev =>
												prev.filter(c => c.id !== comment.id)
											);
											toast('Comment Deleted');
										}}
									>
										Delete Comment
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				)}
			</div>
		</button>
	);
}
