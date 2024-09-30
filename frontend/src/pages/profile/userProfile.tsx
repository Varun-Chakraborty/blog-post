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
        <span>@{user.username}</span>
        <span>{user.role}</span>
      </div>
      <div>
        <div className="flex justify-between gap-4">
          <div className="flex gap-1 items-center">
            <span>{user.posts?.length ?? 0}</span>
            <span>
              {user.posts && user.posts?.length > 1 ? 'Posts' : 'Post'}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span>{user.followers ?? 0}</span>
            <span>
              {user.followers && user.followers > 1 ? 'Followers' : 'Follower'}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span>{user.following ?? 0}</span>
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
