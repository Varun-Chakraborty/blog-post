import { CalendarDays } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { HoverCardContent } from '../ui/hover-card';
import type { Profile } from '@/types/baseTypes';
import { cn } from '@/lib/utils';
import { FollowButton } from '../buttons';
import { useAppSelector } from '@/lib/hooks';

export function UserHoverCard({
	user,
	className
}: Readonly<{ user: Profile; className?: string }>) {
	const { loggedIn } = useAppSelector(state => state.profile);
	return (
		<HoverCardContent className={cn('w-80', className)}>
			<div className="flex items-center space-x-4">
				<Avatar>
					<AvatarImage src={user.profilePicture ?? '/placeholder-user.jpg'} />
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="space-y-1 w-full">
					<div className="flex justify-between items-center w-full">
						<div className="flex flex-col items-start">
							<span className="font-semibold captialize">{user.name}</span>
							<span className="text-sm">@{user.username}</span>
						</div>
						{loggedIn.username !== user.username && (
							<FollowButton user={user} />
						)}
					</div>
					<div className="flex items-center pt-2">
						<CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
						<span className="text-xs text-muted-foreground">
							<span>Joined </span>
							{new Date(user.createdAt).toLocaleDateString(undefined, {
								year: 'numeric',
								month: 'long'
							})}
						</span>
					</div>
				</div>
			</div>
		</HoverCardContent>
	);
}
