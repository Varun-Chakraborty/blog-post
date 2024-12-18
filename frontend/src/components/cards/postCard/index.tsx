import { Post } from '@/types/baseTypes';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { CommentButton, LikeButton } from '@/components/buttons';
import { UserHoverCard } from '@/components/hoverCard';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { postService } from '@/services';
import { useToast } from '@/components/ui/use-toast';

export function Card({ post }: Readonly<{ post: Post }>) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const { toast } = useToast();
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
            <Button variant="link" className="p-0 h-5">
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
            try {
              if (liked) {
                await postService.unLikePost(post!.id);
                setLiked(false);
                setLikesCount(prev => --prev);
              } else {
                await postService.likePost(post!.id);
                setLiked(true);
                setLikesCount(prev => ++prev);
              }
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
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton className="h-8 w-8" key={i} />
        ))}
      </div>
    </div>
  );
}
