import { ProfileCard } from './profileCard';
import { InfiniteLoader } from '@/components/loaders';
import { cn } from '@/lib/utils';
import { APIResponseTypes, Profile } from '@/types';
import { searchMore } from './searchMore';

interface Props {
  profiles: Profile[];
  isLoading: boolean;
  setResults: React.Dispatch<
    React.SetStateAction<APIResponseTypes.SearchResult>
  >;
  count: number;
  query: string;
}

export function Profiles({
  profiles = [],
  isLoading,
  setResults,
  count,
  query
}: Readonly<Props>) {
  return (
    <>
      {profiles.map(profile => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
      <button
        className={cn({ hidden: !profiles.length })}
        onClick={() => searchMore(query, 'users', count, setResults)}
      >
        Load More
      </button>
      {isLoading ? (
        <div className={cn({ 'py-2': profiles.length })}>
          <InfiniteLoader />
        </div>
      ) : (
        !profiles.length && <p>No users found</p>
      )}
    </>
  );
}
