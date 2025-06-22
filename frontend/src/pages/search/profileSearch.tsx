import type { Profile } from '@/types/baseTypes';
import { SearchResponseTypes } from '@/types/responseTypes';
import { searchMore } from './searchMore';
import { ProfilesDisplay } from '@/components/profilesDisplay';

interface Props {
	profiles: Profile[];
	isLoading: boolean;
	setResults: React.Dispatch<
		React.SetStateAction<SearchResponseTypes.SearchResult>
	>;
	query: string;
}

export function Profiles({
	profiles = [],
	isLoading,
	setResults,
	query
}: Readonly<Props>) {
	return (
		<>
			<ProfilesDisplay
				profiles={profiles}
				isLoading={isLoading}
				loadMore={() => searchMore(query, 'users', profiles.length, setResults)}
			/>
		</>
	);
}
