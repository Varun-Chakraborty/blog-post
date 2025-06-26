import { cn } from '@/lib/utils';
import type { Comment } from '@/types/baseTypes';
import { CommentComponentBlock } from './commentComponentBlock';
import { useEffect, useState } from 'react';
import { postService } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export function CommentBlock({
	commentCount,
	parentId,
	className,
	type
}: {
	commentCount: number;
	parentId: string;
	className?: string;
	type: 'COMMENT' | 'REPLY';
}) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (type === 'COMMENT') {
			postService.getCommentsByPostId(parentId).then(res => {
				setIsLoading(false);
				setComments(res!);
			});
		} else {
			postService.getRepliesByCommentId(parentId).then(res => {
				setIsLoading(false);
				setComments(res!);
			});
		}
	}, [parentId, type]);

	const renderLoader = isLoading ? <CommentComponentBlockSkeleton /> : null;

	return (
		<div className={cn('bg-black border rounded shadow-lg p-2', className)}>
			<div className="font-bold p-2 flex gap-2">
				{type === 'COMMENT' ? 'Comments' : 'Replies'}
				<span className="text-primary">{commentCount ?? 0}</span>
			</div>
			<div className="flex flex-col gap-2 mt-2 p-3 border bg-card rounded-md">
				<form
					className="flex gap-2"
					onSubmit={async e => {
						e.preventDefault();
						const comment = (e.currentTarget[0] as HTMLInputElement).value;
						if (comment) {
							try {
								const res =
									type === 'COMMENT'
										? await postService.createComment(comment, parentId)
										: await postService.createReply(comment, parentId);
								setComments(prev => [res!, ...prev]);
								e.currentTarget.reset();
							} catch (error) {
								if (isAxiosError(error)) {
									toast('Error');
								}
								console.error(error);
							}
						}
					}}
				>
					<Input
						placeholder={`Write a ${type.toLowerCase()}...`}
						className="bg-transparent dark:bg-transparent border"
					/>
					<Button
						type="submit"
						className="bg-accent text-accent-foreground hover:bg-accent/80 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/80"
					>
						Send
					</Button>
				</form>
				<div className="pl-5 pt-3 overflow-y-auto">
					{renderLoader ??
						comments.map(comment => (
							<CommentComponentBlock
								key={comment.id}
								comment={comment}
								setComments={setComments}
							/>
						))}
				</div>
			</div>
		</div>
	);
}

function CommentComponentBlockSkeleton() {
	return Array.from({ length: 3 }).map((_, i) => (
		<CommentComponentSkeleton key={i} />
	));
}

function CommentComponentSkeleton() {
	return (
		<div className="flex justify-between items-center">
			<div className="flex gap-2 items-center w-full">
				<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
				<div className="space-y-1 w-full">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-5 w-1/2" />
				</div>
			</div>
			<div className="flex gap-3">
				<Skeleton className="h-10 w-10" />
				<Skeleton className="h-10 w-10" />
			</div>
		</div>
	);
}
