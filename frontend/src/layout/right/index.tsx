import { cn } from '@/lib/utils';
import { WelcomeCard } from '@/components/cards';
import { FollowButton } from '@/components/buttons';
import type { Profile } from '@/types/baseTypes';
import { useEffect, useState } from 'react';
import { userService } from '@/services';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

function SuggestedAccounts({}: Readonly<{}>) {
	const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);

	useEffect(() => {
		userService
			.getSuggestions()
			.then(profiles => {
				setSuggestedUsers(profiles!);
			})
			.catch(e => {
				if (isAxiosError(e)) {
					toast('Error');
				}
				console.error(e);
			});
	}, []);
	return (
		<div className="p-4 space-y-2 border rounded-lg bg-card">
			<div className="font-roboto-condensed uppercase text-lg p-2">
				Suggested Accounts
			</div>
			<ul className="space-y-2 p-2 overflow-y-auto h-80 w-full">
				{suggestedUsers.map((user: Profile) => (
					<li
						key={user.id}
						className="flex gap-2 justify-between items-center p-2 rounded-lg hover:bg-primary/10 cursor-pointer"
					>
						<Link
							to={`/user/${user.username}`}
							state={user}
							className="flex justify-between items-center w-full"
						>
							<div className="flex items-center gap-2">
								<img
									className="h-8 w-8 object-cover rounded-full"
									src={user.profilePicture || '/placeholder-user.jpg'}
									alt=""
								/>
								<p>{user.name}</p>
							</div>
							<FollowButton user={user} />
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export function RightPanel({ className }: Readonly<{ className?: string }>) {
	return (
		<div
			className={cn(
				'sm:static fixed lg:flex hidden flex-col transition-all p-3 space-y-2 z-50 select-none h-full w-1/4 shrink-0 overflow-y-auto',
				className
			)}
		>
			<WelcomeCard />
			<hr />
			<SuggestedAccounts />
		</div>
	);
}
