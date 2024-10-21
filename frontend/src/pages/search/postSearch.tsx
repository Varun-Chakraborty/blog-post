import { PostCard } from './postCard';
import { InfiniteLoader } from '@/components/loaders';
import { cn } from '@/lib/utils';
import { APIResponseTypes, Post } from '@/types';
import { searchMore } from './searchMore';

interface Props {
  posts: Post[];
  isLoading: boolean;
  setResults: React.Dispatch<
    React.SetStateAction<APIResponseTypes.SearchResult>
  >;
  count: number;
  query: string;
}

export function Posts({
  posts = [],
  isLoading,
  setResults,
  count,
  query
}: Readonly<Props>) {
  return (
    <>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <button
        className={cn({ hidden: !posts.length })}
        onClick={() => searchMore(query, 'users', count, setResults)}
      >
        Load More
      </button>
      {isLoading ? (
        <div className={cn({ 'py-2': posts.length })}>
          <InfiniteLoader />
        </div>
      ) : (
        !posts.length && <p>No posts found</p>
      )}
    </>
  );
}
