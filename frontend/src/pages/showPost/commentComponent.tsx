import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import {
  DeleteButton,
  EditButton,
  LikeButton,
  ReplyButton
} from '@/components/buttons';
import { UserHoverCard } from '@/components/hoverCard';
import { Comment } from '@/types';
import { useAppSelector } from '@/hooks';
import { postService } from '@/services';
import { isAxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export function CommentComponent({
  comment,
  setShowReplies,
  type,
  className
}: Readonly<{
  comment: Comment;
  setShowReplies: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'COMMENT' | 'REPLY';
  className?: string;
}>) {
  const { profile } = useAppSelector(state => state.profile);
  const { toast } = useToast();
  const [likesCount, setLikesCount] = useState(comment._count.likes ?? 0);
  const [liked, setLiked] = useState(comment.liked);
  return (
    <div
      className={cn(
        'flex justify-between items-center hover:bg-muted dark:hover:bg-muted/10 cursor-pointer p-2 rounded-lg',
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
        {profile?.id === comment.author.id && (
          <>
            <EditButton onClick={() => {}} />
            <DeleteButton onClick={() => {}} />
          </>
        )}
        {type === 'COMMENT' && (
          <ReplyButton
            onClick={() => setShowReplies(prev => !prev)}
            commentsCount={comment._count?.replies}
          />
        )}
        <LikeButton
          liked={liked}
          onClick={async () => {
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
                toast({
                  title: 'Error',
                  description: error.response?.data.message
                });
              }
              console.error(error);
            }
          }}
          likesCount={likesCount}
        />
      </div>
    </div>
  );
}
