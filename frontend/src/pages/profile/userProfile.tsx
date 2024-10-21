import { AdminCapsule /* PremiumCapsule */ } from '@/components/capsules';
import { User } from '@/types';

export function UserProfile({ user }: Readonly<{ user: User }>) {
  return (
    <div className="rounded-lg border flex flex-col items-center gap-4 p-2 h-fit">
      <div className="flex flex-col items-center">
        <img
          src={user.pfp ?? '/placeholder-user.jpg'}
          alt=""
          className="rounded-full w-24 mb-5"
        />
        <div className="flex flex-col items-center">
          <span>@{user.username}</span>
          <div>
            {user.role === 'ADMIN' && <AdminCapsule />}
            {/* {user.premium && <PremiumCapsule />} */}
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
