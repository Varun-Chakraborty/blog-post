import { User } from '@/types';
import { AdminBadge, PremiumBadge } from '@/components/badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfile({ user }: Readonly<{ user: User }>) {
  return (
    <div className="rounded-lg border flex flex-col items-center gap-4 p-2 h-fit">
      <div className="flex flex-col items-center">
        <Avatar>
          <AvatarImage src={user.pfp ?? '/placeholder-user.jpg'} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center">
          <span>@{user.username}</span>
          <div>
            {user.role === 'ADMIN' && <AdminBadge />}
            {/* {user.premium && <PremiumBadge />} */}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-4">
          <div className="flex justify-center gap-1">
            <span>{user.posts.length}</span>
            <span>{user.posts.length > 1 ? 'Posts' : 'Post'}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span>{user.followersCount}</span>
            <span>{user.followersCount > 1 ? 'Followers' : 'Follower'}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span>{user.followingCount}</span>
            <span>Following</span>
          </div>
        </div>
      </div>
      <div>
        <p>{user.bio ?? 'No bio'}</p>
      </div>
    </div>
  );
}
