import { useEffect, useState } from 'react';
import { CommentComponent } from './commentComponent';
import { cn } from '@/lib/utils';
import { Comment } from '@/types';
import { postService } from '@/services';
import { InfiniteLoader } from '@/components/loaders';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';

export function RepliesBlock({
  commentId,
  className
}: {
  commentId: string;
  className?: string;
}) {
  const [replies, setReplies] = useState<Omit<Comment, 'repliesCount'>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    postService.getRepliesByCommentId(commentId).then(res => {
      setIsLoading(false);
      setReplies(res!);
    });
  }, [commentId]);

  const renderLoader = isLoading ? <InfiniteLoader /> : null;

  return (
    <div className={cn('pl-5', className)}>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const message = (e.currentTarget[0] as HTMLInputElement).value;
          try {
            const res = await postService.createReply(message, commentId);
            setReplies([res!, ...replies]);
          } catch (error) {
            if (isAxiosError(error)) {
              toast({
                title: 'Error',
                description: error.response?.data.message,
                variant: 'destructive'
              });
            }
            console.error(error);
          }
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Reply"
          className="bg-inherit dark:bg-inherit border"
        />
        <Button
          type="submit"
          className="bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground"
        >
          Reply
        </Button>
      </form>
      {renderLoader ??
        replies.map(reply => (
          <CommentComponent key={reply.id} comment={reply} type="REPLY" />
        ))}
    </div>
  );
}
