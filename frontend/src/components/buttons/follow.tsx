import { userService } from '@/services';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User } from '@/types/baseTypes';

export function Follow({
  isLoggedIn,
  user,
  className
}: {
  isLoggedIn: boolean;
  user: User;
  className?: string;
}) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState<boolean>(false);

  useEffect(() => {
    userService
      .getIfFollowedByCurrentUser(user.username)
      .then(followed => setFollowing(followed));
  }, [user.username]);

  return (
    <Button
      className={cn(
        'bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground hover:bg-accent/80 dark:hover:bg-accent/80 font-semibold p-2 rounded',
        className
      )}
      onClick={async () => {
        if (isLoggedIn) {
          if (following) {
            await userService.unfollowUser(user.username);
            setFollowing(false);
          } else {
            await userService.followUser(user.username);
            setFollowing(true);
          }
        } else navigate('/login');
      }}
    >
      {isLoggedIn ? (following ? 'Unfollow' : 'Follow') : 'Login to follow'}
    </Button>
  );
}
