import { PostCard, PostCardSkeleton } from '@/components/cards';
import { cn } from '@/lib/utils';
import { Post } from '@/types/baseTypes';

export function PostsDisplay({
  posts,
  isLoading,
  loadMore,
  className
}: Readonly<{
  posts: Post[];
  isLoading: boolean;
  loadMore?: () => void;
  className?: string;
}>) {
  return (
    <>
      {!isLoading && posts.length === 0 && (
        <div className="h-full w-full flex justify-center items-center font-bold uppercase text-xl">
          No posts found
        </div>
      )}
      <div
        className={cn(
          'h-fit w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
          className
        )}
      >
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {isLoading && [...Array(7)].map((_, i) => <PostCardSkeleton key={i} />)}
      </div>
      {loadMore && (
        <button
          className="w-full bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200"
          onClick={loadMore}
        >
          Load more
        </button>
      )}
    </>
  );
}
