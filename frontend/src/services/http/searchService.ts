import { SearchResponseTypes } from '@/types/responseTypes';
import { HTTPService } from './httpService';

class SearchService extends HTTPService {
	constructor() {
		super();
	}

	async search(query: string, searchFor?: 'users' | 'posts', skip?: number) {
		const params = [
			`query=${query}`,
			searchFor ? `searchFor=${searchFor}` : '',
			skip ? `skip=${skip}` : ''
		]
			.filter(Boolean)
			.join('&');

		const response = await this.api.get<SearchResponseTypes.SearchResponse>(
			`/search?${params}`
		);
		return response.data.data!.searchResult;
	}
}

export default new SearchService();
