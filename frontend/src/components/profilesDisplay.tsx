import { Profile } from '@/types/baseTypes';
import { ProfileCard, ProfileCardSkeleton } from './cards';
import { cn } from '@/lib/utils';

export function ProfilesDisplay({
  profiles,
  isLoading,
  loadMore,
  className
}: Readonly<{
  profiles: Profile[];
  isLoading: boolean;
  loadMore?: () => void;
  className?: string;
}>) {
  return (
    <>
      {!isLoading && profiles.length === 0 && (
        <div className="h-full w-full flex justify-center items-center font-bold uppercase text-xl">
          No profiles found
        </div>
      )}
      <div
        className={cn(
          'h-full w-full p-4 flex flex-col gap-4 overflow-y-auto',
          className
        )}
      >
        {profiles.map(profile => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
        {isLoading &&
          [...Array(7)].map((_, i) => <ProfileCardSkeleton key={i} />)}
      </div>
      {loadMore && (
        <button
          className="w-full bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200"
          onClick={loadMore}
        >
          Load more
        </button>
      )}
    </>
  );
}
