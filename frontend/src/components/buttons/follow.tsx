import { userService } from '@/services';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Profile } from '@/types/baseTypes';
import { useAppSelector } from '@/lib/hooks';

export function Follow({
	user,
	nextUrl,
	className
}: Readonly<{
	user: Profile;
	nextUrl: string;
	className?: string;
}>) {
	const navigate = useNavigate();
	const [following, setFollowing] = useState<boolean>(false);
	const { isGuest } = useAppSelector(state => state.profile.loggedIn);

	useEffect(() => {
		userService
			.getIfFollowedByCurrentUser(user.username)
			.then(followed => setFollowing(followed));
	}, [user.username]);

	return (
		<Button
			variant="outline"
			className={cn('rounded-full text-accent outline-accent', className)}
			onClick={async e => {
				e.stopPropagation();
				if (!isGuest) {
					if (following) {
						await userService.unfollowUser(user.username);
						setFollowing(false);
					} else {
						await userService.followUser(user.username);
						setFollowing(true);
					}
				} else navigate(`/auth/signin?next=${nextUrl}`);
			}}
		>
			{following ? 'Unfollow' : 'Follow'}
		</Button>
	);
}
