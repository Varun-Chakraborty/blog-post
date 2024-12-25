import { SearchResponseTypes } from '@/types/responseTypes';
import { Post } from '@/types/baseTypes';
import { PostsDisplay } from '@/components/postsDisplay';
import { searchMore } from './searchMore';

interface Props {
  posts: Post[];
  isLoading: boolean;
  setResults: React.Dispatch<
    React.SetStateAction<SearchResponseTypes.SearchResult>
  >;
  query: string;
}

export function Posts({
  posts = [],
  isLoading,
  setResults,
  query
}: Readonly<Props>) {
  return (
    <>
      <PostsDisplay
        posts={posts}
        isLoading={isLoading}
        loadMore={() => searchMore(query, 'posts', posts.length, setResults)}
      />
    </>
  );
}
