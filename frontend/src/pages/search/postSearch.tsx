import { PostCard } from "@/components/cards";
import { InfiniteLoader } from "@/components/loaders";
import { cn } from "@/lib/utils";
import { Post } from "@/types";

interface Props {
  posts: Post[];
  isLoading: boolean;
}

export function Posts({ posts = [], isLoading }: Readonly<Props>) {
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {isLoading ? (
        <div className={cn({ "py-2": posts.length })}>
          <InfiniteLoader />
        </div>
      ) : (
        !posts.length && <p>No posts found</p>
      )}
    </>
  );
}
