import { searchService } from '@/services';
import { SearchResponseTypes } from '@/types/responseTypes';

export async function searchMore(
	query: string,
	searchFor: 'users' | 'posts',
	skipTill: number,
	setResult: React.Dispatch<
		React.SetStateAction<SearchResponseTypes.SearchResult>
	>
) {
	const newItems = (await searchService.search(query, searchFor, skipTill))
		.users;
	setResult(prev => ({
		...prev,
		[searchFor]: [...prev[searchFor], ...newItems]
	}));
}
