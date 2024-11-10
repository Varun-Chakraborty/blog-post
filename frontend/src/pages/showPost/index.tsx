import { InfiniteLoader } from '@/components/loaders';
import { cn } from '@/lib/utils';
import { Post } from '@/types/baseTypes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '@/services';
import { CommentBlock } from './commentBlock';
import {
  CommentButton,
  DeleteButton,
  EditButton,
  LikeButton,
  ShareButton
} from '@/components/buttons';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { UserHoverCard } from '@/components/hoverCard';
import { useAppSelector } from '@/hooks';
import { isAxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

export function ShowPost({ className }: Readonly<{ className?: string }>) {
  const { id } = useParams();
  const { profile } = useAppSelector(state => state.profile);

  const [post, setPost] = useState<Post | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [liked, setLiked] = useState<boolean>(post?.liked ?? false);
  const [likesCount, setLikesCount] = useState<number>(post?._count.likes ?? 0);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    postService
      .getPostById(id!)
      .then(res => {
        setIsLoading(false);
        setPost(res);
        setLiked(res?.liked ?? false);
        setLikesCount(res?._count.likes ?? 0);
      })
      .catch(e => {
        console.error(e);
      });
  }, [id]);

  const renderLoader = isLoading ? <InfiniteLoader /> : null;

  return (
    <div className={cn('h-full w-full box-border', className)}>
      {renderLoader ?? (
        <div className="h-full w-full p-4 space-y-3 overflow-scroll overscroll-none relative">
          <div className="relative min-h-[60%]">
            <div className="absolute top-0 left-0 rounded-lg overflow-clip h-full w-full">
              <img
                src={post?.imgUrl}
                alt=""
                className="w-full h-full object-cover brightness-50"
              />
            </div>
            <div className="relative z-50 text-white p-4 selection:bg-slate-600">
              <div className="flex justify-between">
                <div className="font-montserrat">
                  <div className="text-2xl font-bold">{post?.title}</div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="link"
                        className="p-0 h-5 text-white"
                        onClick={() =>
                          navigate(`/user/${post?.author.username}`)
                        }
                      >
                        Posted by: @{post?.author.username}
                      </Button>
                    </HoverCardTrigger>
                    <UserHoverCard user={post!.author} />
                  </HoverCard>
                </div>
                {profile?.username === post?.author.username && (
                  <div className="flex gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DeleteButton />
                      </AlertDialogTrigger>
                      <DeleteDialog postId={post!.id} />
                    </AlertDialog>
                    <EditButton />
                  </div>
                )}
              </div>
              <div className="text-lg font-montserrat w-full h-full mt-2">
                {post?.content}
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <LikeButton
              liked={liked}
              onClick={async () => {
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
              likesCount={likesCount}
            />
            <CommentButton
              commentsCount={post!._count.comments}
              onClick={() => {}}
            />
            <ShareButton />
          </div>
          <CommentBlock
            commentCount={post!._count.comments}
            postId={post!.id}
          />
        </div>
      )}
    </div>
  );
}

function DeleteDialog({ postId }: Readonly<{ postId: Post['id'] }>) {
  const { toast } = useToast();
  const navigate = useNavigate();
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your post
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            try {
              await postService.deletePost(postId);
              toast({
                title: 'Deleted',
                description: 'Your post has been deleted.',
                variant: 'destructive'
              });
              navigate('/post');
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
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
