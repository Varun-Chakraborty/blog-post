import type { Profile } from '@/types/baseTypes';
import { ProfileCard, ProfileCardSkeleton } from './cards';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function ProfilesDisplay({
	profiles,
	isLoading,
	loadMore,
	className
}: Readonly<{
	profiles: Profile[];
	isLoading: boolean;
	loadMore?: () => void;
	className?: string;
}>) {
	return (
		<>
			{!isLoading && profiles.length === 0 ? (
				<div className="h-full w-full flex justify-center items-center font-bold uppercase text-xl">
					No profiles found
				</div>
			) : (
				<>
					<div
						className={cn(
							'h-fit w-full flex flex-col gap-4 overflow-y-auto',
							className
						)}
					>
						{profiles.map(profile => (
							<ProfileCard key={profile.id} profile={profile} />
						))}
						{isLoading &&
							[...Array(7)].map((_, i) => <ProfileCardSkeleton key={i} />)}
					</div>
					{loadMore && (
						<Button variant="outline" className="w-full" onClick={loadMore}>
							Load more
						</Button>
					)}
				</>
			)}
		</>
	);
}
