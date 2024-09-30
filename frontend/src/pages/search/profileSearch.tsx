import { ProfileCard } from "@/components/cards";
import { InfiniteLoader } from "@/components/loaders";
import { cn } from "@/lib/utils";
import { Profile } from "@/types";

interface Props {
  profiles: Profile[];
  isLoading: boolean;
}

export function Profiles({ profiles = [], isLoading }: Readonly<Props>) {
  return (
    <>
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
      {isLoading ? (
        <div className={cn({ "py-2": profiles.length })}>
          <InfiniteLoader />
        </div>
      ) : (
        !profiles.length && <p>No users found</p>
      )}
    </>
  );
}
