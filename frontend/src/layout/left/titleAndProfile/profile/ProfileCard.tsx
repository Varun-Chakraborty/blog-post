import { Profile } from '@/types';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { AdminCapsule /* PremiumCapsule */ } from '@/components/capsules';
import { cn } from '@/lib/utils';

interface ProfileProps {
  profile: Profile;
  current?: boolean;
  onClick: () => void;
  listOpen?: boolean;
}

export function ProfileCard({
  profile,
  current = false,
  onClick,
  listOpen
}: Readonly<ProfileProps>) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between bg-cardBackgroundColor cursor-pointer hover:bg-background p-3 w-full"
      type="button"
    >
      <div className="flex items-center gap-2">
        <img
          src={profile.pfp ?? '/placeholder-user.jpg'}
          alt=""
          className="w-10 h-10 rounded-full border border-borderColor"
        />
        <div className="flex flex-col justify-center">
          <span className="font-semibold uppercase text-sm">
            {profile.name}
          </span>
          <span className="text-secondaryText text-xs">
            @{profile.username}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        {profile.role === 'ADMIN' && <AdminCapsule className={cn('')} />}
        {/* {profile.premium && <PremiumCapsule className={cn('')} />} */}
        {current &&
          (listOpen ? (
            <IoChevronUp className="w-4 h-4" />
          ) : (
            <IoChevronDown className="w-4 h-4" />
          ))}
      </div>
    </button>
  );
}
