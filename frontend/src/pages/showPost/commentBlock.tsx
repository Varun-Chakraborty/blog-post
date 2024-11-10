import { cn } from '@/lib/utils';
import { Comment } from '@/types';
import { CommentComponentBlock } from './commentComponentBlock';
import { useEffect, useState } from 'react';
import { postService } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';

export function CommentBlock({
  commentCount,
  postId,
  className
}: {
  commentCount: number;
  postId: string;
  className?: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    postService.getCommentsByPostId(postId).then(res => {
      setIsLoading(false);
      setComments(res!);
    });
  }, [postId]);

  const renderLoader = isLoading ? <CommentComponentBlockSkeleton /> : null;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="font-bold">
        Comments<span className="ml-2 text-primary">{commentCount ?? 2}</span>
      </div>
      <form
        className="flex gap-2"
        onSubmit={async e => {
          e.preventDefault();
          const comment = (e.currentTarget[0] as HTMLInputElement).value;
          if (comment) {
            try {
              const res = await postService.createComment(postId, comment);
              setComments(prev => [res!, ...prev]);
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
          }
        }}
      >
        <Input
          placeholder="Write a comment"
          className="bg-transparent dark:bg-transparent border"
        />
        <Button
          type="submit"
          className="bg-accent text-accent-foreground hover:bg-accent/80 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/80"
        >
          Send
        </Button>
      </form>
      <div className="pl-5 overflow-y-auto">
        {renderLoader ??
          comments.map(comment => (
            <CommentComponentBlock key={comment.id} comment={comment} />
          ))}
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
