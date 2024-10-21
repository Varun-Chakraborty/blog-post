import api from '@/api';
import { SearchBar } from '@/components/searchBar';
import { cn } from '@/lib/utils';
import { APIResponseTypes } from '@/types';
import { useEffect, useState } from 'react';
import { Posts } from './postSearch';
import { Profiles } from './profileSearch';

export function Search({ className }: Readonly<{ className?: string }>) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const newSearchQuery = new URLSearchParams(window.location.search).get("q");
  const [results, setResults] = useState<APIResponseTypes.SearchResult>({
    users: [],
    posts: []
  });
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"users" | "posts">("users");
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (newSearchQuery !== searchQuery) {
        setLoading(true);
        setSearchQuery(newSearchQuery!);
        let results = await api.search(newSearchQuery!);
        setResults(results);
        setLoading(false);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
      setLoading(false);
    };
  }, [newSearchQuery]);
  return (
    <div className={cn("h-full w-full box-border", className)}>
      <div className="flex justify-center w-full">
        <SearchBar full className="sm:hidden mb-4" />
      </div>
      <div className="w-full flex border-b">
        <button
          onClick={() => setType("users")}
          className={cn(
            "w-full text-center p-2 cursor-pointer hover:bg-primary/10 rounded-t",
            { "border-b-2": type === "users" }
          )}
          type="button"
        >
          User
        </button>
        <button
          onClick={() => setType("posts")}
          className={cn(
            "w-full text-center p-2 cursor-pointer hover:bg-primary/10 rounded-t",
            { "border-b-2": type === "posts" }
          )}
        >
          Post
        </button>
      </div>
      <div className="p-4">
        {type === "users" ? (
          <Profiles profiles={results.users} isLoading={loading} />
        ) : (
          <Posts posts={results.posts} isLoading={loading} />
        )}
      </div>
    </div>
  );
}
