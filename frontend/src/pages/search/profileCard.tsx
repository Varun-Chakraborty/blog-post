import { Profile } from '@/types';
import { useNavigate } from 'react-router-dom';

export function ProfileCard({ profile }: Readonly<{ profile: Profile }>) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/user/${profile.username}`)}
      className="p-3 w-full hover:bg-primary/10 border-b border-borderColor cursor-pointer flex gap-3 rounded-lg"
      type="button"
    >
      <img
        src={profile.pfp ?? '/placeholder-user.jpg'}
        alt=""
        className="w-10 h-10 rounded-full border border-borderColor"
      />
      <div>
        <span className="font-bold text-accent group-hover:underline">
          {profile.name}
        </span>
        <p className="text-sm text-gray-400">@{profile.username}</p>
      </div>
    </button>
  );
}
