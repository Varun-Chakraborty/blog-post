import { searchService } from '@/services';
import { APIResponseTypes } from '@/types';

export async function searchMore(
  query: string,
  searchFor: 'users' | 'posts',
  skipTill: number,
  setResult: React.Dispatch<React.SetStateAction<APIResponseTypes.SearchResult>>
) {
  const newItems = (await searchService.search(query, searchFor, skipTill))
    .users;
  setResult(prev => ({
    ...prev,
    [searchFor]: [...prev[searchFor], ...newItems]
  }));
}
