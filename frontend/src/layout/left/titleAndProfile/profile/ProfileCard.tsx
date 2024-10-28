import { Profile } from '@/types';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { AdminBadge, PremiumBadge } from '@/components/badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
        <Avatar>
          <AvatarImage src={profile.pfp ?? '/placeholder-user.jpg'} />
          <AvatarFallback>
            {profile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
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
        {profile.role === 'ADMIN' && <AdminBadge />}
        {/* {profile.premium && <PremiumBadge />} */}
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
