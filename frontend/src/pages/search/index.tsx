import api from '@/api';
import { SearchBar } from '@/components/searchBar';
import { cn } from '@/lib/utils';
import { APIResponseTypes } from '@/types';
import { useEffect, useState } from 'react';
import { Posts } from './postSearch';
import { Profiles } from './profileSearch';
import { useLocation } from 'react-router-dom';
import { NetworkError } from '@/components/networkError';

export function Search({ className }: Readonly<{ className?: string }>) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const location = useLocation();
  const newSearchQuery = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState<APIResponseTypes.SearchResult>({
    users: [],
    posts: []
  });
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'users' | 'posts'>('users');
  const [isNetworkError, setIsNetworkError] = useState(false);
  useEffect(() => {
    if (newSearchQuery !== searchQuery && newSearchQuery) {
      setLoading(true);
      setSearchQuery(newSearchQuery);
      api
        .search(newSearchQuery)
        .then(res => {
          setResults(res);
        })
        .catch(e => {
          if (e.message === 'Network Error') {
            setIsNetworkError(true);
          } else console.error(e);
        })
        .finally(() => setLoading(false));
    }
  }, [newSearchQuery]);

  const renderNetworkError = isNetworkError ? <NetworkError /> : null;
  const renderResults =
    type === 'users' ? (
      <Profiles
        profiles={results.users}
        isLoading={loading}
        setResults={setResults}
        count={results.users.length}
        query={searchQuery!}
      />
    ) : (
      <Posts
        posts={results.posts}
        isLoading={loading}
        setResults={setResults}
        count={results.posts.length}
        query={searchQuery!}
      />
    );
  return (
    <div className={cn('h-full w-full box-border lg:p-2', className)}>
      <div className="sm:hidden flex justify-center w-full">
        <SearchBar full className="mb-4" />
      </div>
      {renderNetworkError ?? (
        <>
          <div className="w-full flex border-b">
            <button
              onClick={() => setType('users')}
              className={cn(
                'w-full text-center p-2 cursor-pointer hover:bg-primary/10 rounded-t',
                { 'border-b-2': type === 'users' }
              )}
              type="button"
            >
              User
            </button>
            <button
              onClick={() => setType('posts')}
              className={cn(
                'w-full text-center p-2 cursor-pointer hover:bg-primary/10 rounded-t',
                { 'border-b-2': type === 'posts' }
              )}
            >
              Post
            </button>
          </div>
          <div className="p-4">
            {!searchQuery ? (
              <div className="text-center">
                Enter a query in the search bar to get started
              </div>
            ) : (
              renderResults
            )}
          </div>
        </>
      )}
    </div>
  );
}
