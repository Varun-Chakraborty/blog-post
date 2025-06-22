import { searchService } from '@/services';
import { SearchBar } from '@/components/searchBar';
import { cn } from '@/lib/utils';
import { SearchResponseTypes } from '@/types/responseTypes';
import { useEffect, useState } from 'react';
import { Posts } from './postSearch';
import { Profiles } from './profileSearch';
import { useLocation } from 'react-router-dom';
import { NetworkError } from '@/components/networkError';

export function Search({ className }: Readonly<{ className?: string }>) {
	const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
	const location = useLocation();
	const newSearchQuery = new URLSearchParams(location.search).get('q');
	const [results, setResults] = useState<SearchResponseTypes.SearchResult>({
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
			searchService
				.search(newSearchQuery)
				.then(res => {
					setResults(res!);
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
				query={searchQuery!}
			/>
		) : (
			<Posts
				posts={results.posts}
				isLoading={loading}
				setResults={setResults}
				query={searchQuery!}
			/>
		);
	return (
		<div
			className={cn('h-full w-full flex flex-col box-border lg:p-5', className)}
		>
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
					<div className="p-4 h-full space-y-4 overflow-y-scroll">
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
