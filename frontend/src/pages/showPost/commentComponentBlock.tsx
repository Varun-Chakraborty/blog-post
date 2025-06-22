import { useState } from 'react';
import { CommentComponent } from './commentComponent';
import { cn } from '@/lib/utils';
import type { Comment } from '@/types/baseTypes';
import { CommentBlock } from './commentBlock';

export function CommentComponentBlock({
	comment,
	setComments,
	className
}: Readonly<{
	comment: Comment;
	setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
	className?: string;
}>) {
	const [showReplies, setShowReplies] = useState(false);
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<CommentComponent
				comment={comment}
				setComments={setComments}
				setShowReplies={setShowReplies}
				type="COMMENT"
			/>
			{showReplies && (
				<CommentBlock
					commentCount={comment._count.replies}
					parentId={comment.id}
					type="REPLY"
				/>
			)}
		</div>
	);
}
