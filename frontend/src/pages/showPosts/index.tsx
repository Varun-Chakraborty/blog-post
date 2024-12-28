import { NetworkError } from '@/components/networkError';
import { PostsDisplay } from '@/components/postsDisplay';
import { useToast } from '@/components/ui/use-toast';
import { postService } from '@/services';
import { Post } from '@/types/baseTypes';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

export function ShowPosts({ className }: Readonly<{ className?: string }>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);
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
        } else {
          if (e.message === 'Network Error') {
            setIsNetworkError(true);
          }
        }
        console.error(e);
      });
  }, []);

  const netWorkError = isNetworkError ? <NetworkError /> : null;

  return (
    netWorkError ?? (
      <div className="p-6 h-full">
        <PostsDisplay
          posts={posts}
          isLoading={isLoading}
          className={className}
        />
      </div>
    )
  );
}
