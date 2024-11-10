import { PostsDisplay } from '@/components/postsDisplay';
import { useToast } from '@/components/ui/use-toast';
import { postService } from '@/services';
import { Post } from '@/types';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

export function ShowPosts({ className }: Readonly<{ className?: string }>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    postService
      .getPosts()
      .then(res => {
        setIsLoading(false);
        setPosts(res!);
      })
      .catch(e => {
        setIsLoading(false);
        if (isAxiosError(e)) {
          toast({
            title: 'Error',
            description: e.response?.data.message
          });
        }
        console.error(e);
      });
  }, []);

  return (
    <PostsDisplay posts={posts} isLoading={isLoading} className={className} />
  );
}
