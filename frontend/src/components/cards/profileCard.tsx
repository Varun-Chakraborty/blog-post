import { Profile } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function ProfileCard({ profile }: Readonly<{ profile: Profile }>) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/profile/${profile.username}`)}
      className="p-3 hover:bg-primary/10 border-b border-borderColor cursor-pointer flex gap-3 rounded-lg"
      type="button"
    >
      <Avatar>
        <AvatarImage src={profile.pfp ?? '/placeholder-user.jpg'} />
        <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <span className="font-bold text-accent group-hover:underline">
          {profile.name}
        </span>
        <p className="text-sm text-gray-400">@{profile.username}</p>
      </div>
    </button>
  );
}
