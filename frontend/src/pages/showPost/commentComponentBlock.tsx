import { useState } from 'react';
import { CommentComponent } from './commentComponent';
import { cn } from '@/lib/utils';
import { RepliesBlock } from './replyBlock';
import { Comment } from '@/types/baseTypes';

export function CommentComponentBlock({
  comment,
  className
}: Readonly<{ comment: Comment; className?: string }>) {
  const [showReplies, setShowReplies] = useState(false);
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <CommentComponent
        comment={comment}
        setShowReplies={setShowReplies}
        type="COMMENT"
      />
      {showReplies && <RepliesBlock commentId={comment.id} />}
    </div>
  );
}
