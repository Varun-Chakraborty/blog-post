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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { ParseMarkdown } from '@/components/parseMarkdown';
import { handleLikePost } from '@/helperFunctions/likePost.ts';

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
                    <EditButton
                      onClick={() =>
                        navigate(`/post/${post!.id}/edit`, { state: { post } })
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DeleteButton />
                      </AlertDialogTrigger>
                      <DeleteDialog postId={post!.id} />
                    </AlertDialog>
                  </div>
                )}
              </div>
              <div className="text-lg font-montserrat w-full h-full mt-2">
                <ParseMarkdown markdown={post!.content} />
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <LikeButton
              liked={liked}
              onClick={async () => {
                await handleLikePost(
                  liked,
                  setLiked,
                  setLikesCount,
                  post!,
                  toast
                );
              }}
              likesCount={likesCount}
            />
            <CommentButton
              commentsCount={post!._count.comments}
              onClick={() => {}}
            />
            <Dialog>
              <DialogTrigger asChild>
                <ShareButton />
              </DialogTrigger>
              <ShareDialog postId={post!.id} />
            </Dialog>
          </div>
          <CommentBlock
            commentCount={post!._count.comments}
            parentId={post!.id}
            type="COMMENT"
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
                description: 'Your post has been deleted.'
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

function ShareDialog({ postId }: Readonly<{ postId: Post['id'] }>) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            defaultValue="https://ui.shadcn.com/docs/installation"
            readOnly
          />
        </div>
        <Button type="submit" size="sm" className="px-3">
          <span className="sr-only">Copy</span>
          <Copy />
        </Button>
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
