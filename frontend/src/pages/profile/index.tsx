import { userService } from '@/services';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector, isGuestProfile } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { profileActions } from '@/lib/redux/profile';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Post, Profile, User } from '@/types/baseTypes';
import { UserProfile } from './userProfile';
import { NotFound } from './notFound';
import { NetworkError } from '@/components/networkError';
import { Separator } from '@/components/ui/separator';
import { PostsDisplay } from '@/components/postsDisplay';
import { FollowButton } from '@/components/buttons';
import { EditProfile } from '@/components/buttons/editProfile';
import { ProfilesDisplay } from '@/components/profilesDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCardSkeleton } from '@/components/cards';

export function Profile({ className }: Readonly<{ className?: string }>) {
	const [user, setUser] = useState<User | undefined>(undefined);

	const { username } = useParams();
	const { profile } = useAppSelector(state => state.profile);
	const isItMyProfile = username === 'me' || username === profile.username;
	const [loading, setLoading] = useState(true);
	const [isNetworkError, setIsNetworkError] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isLoggedIn = !isGuestProfile();

	useEffect(() => {
		setLoading(true);
		userService
			.getProfile(username!)
			.then(profile => {
				setUser(profile);
			})
			.catch(err => {
				if (isAxiosError(err)) {
					console.error(err.response);
					if (err.response?.status === 401) {
						toast('Session expired');
						dispatch(profileActions.removeProfile());
						navigate('/login');
					} else {
						toast('Could not get profile');
					}
				} else {
					if (err.message !== 'Network Error') {
						toast('Could not get profile');
						return console.error(err);
					}
					setIsNetworkError(true);
				}
			})
			.finally(() => setLoading(false));
	}, []);

	const renderLoader = loading ? <Loader /> : null;
	const renderNetworkError = isNetworkError ? <NetworkError /> : null;

	return (
		<div className={cn('h-full w-full box-border p-3', className)}>
			{renderLoader ??
				renderNetworkError ??
				(user ? (
					<UserComponent
						user={user}
						isItMyProfile={isItMyProfile}
						isLoggedIn={isLoggedIn}
					/>
				) : (
					<NotFound />
				))}
		</div>
	);
}

function UserComponent({
	user,
	isItMyProfile,
	isLoggedIn
}: Readonly<{ user: User; isItMyProfile: boolean; isLoggedIn: boolean }>) {
	const currentSection = useParams().section as
		| 'posts'
		| 'likes'
		| 'followers'
		| 'following';
	const navigate = useNavigate();
	const sections = {
		posts: <ShowPosts username={user.username} />,
		likes: <ShowLikes />,
		followers: <ShowFollowers username={user.username} />,
		following: <ShowFollowing username={user.username} />
	};
	return (
		<div className="h-full w-full">
			<div className={`h-[calc(min(20%, 200px))] bg-[url(${user.banner})]`} />
			<div className="flex h-full">
				<UserProfile user={user} />
				<Separator orientation="vertical" className="h-full" />
				<div className="w-full">
					<div className="flex pb-2 justify-between items-center">
						<ul className="flex gap-4 pl-5">
							{[
								{ title: 'Posts', onClick: () => navigate('?section=posts') },
								{ title: 'Likes', onClick: () => navigate('?section=likes') },
								{
									title: 'Followers',
									onClick: () => navigate('?section=followers')
								},
								{
									title: 'Following',
									onClick: () => navigate('?section=following')
								}
							].map(menu => (
								<li className="relative" key={menu.title}>
									<button
										className={cn(
											'p-2 hover:bg-primary/20 transition-all duration-300 rounded',
											{
												'borber-b-2 border-primary':
													menu.title === currentSection,
												hidden: menu.title === 'Likes' && !isItMyProfile
											}
										)}
										onClick={menu.onClick}
									>
										{menu.title}
									</button>
								</li>
							))}
						</ul>
						{isLoggedIn && isItMyProfile ? (
							<EditProfile />
						) : (
							<FollowButton isLoggedIn={isLoggedIn} user={user} />
						)}
					</div>
					<Separator />
					<div className="p-2">{sections[currentSection]}</div>
				</div>
			</div>
		</div>
	);
}

function ShowPosts({
	username,
	className
}: Readonly<{ username: string; className?: string }>) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		userService
			.getPostsByUsername(username)
			.then(posts => {
				setPosts(posts!);
				setIsLoading(false);
			})
			.catch(e => {
				if (isAxiosError(e)) {
					toast('Error');
				}
				setIsLoading(false);
				console.error(e);
			});
	}, []);
	return (
		<PostsDisplay posts={posts} isLoading={isLoading} className={className} />
	);
}

function ShowLikes({ className }: Readonly<{ className?: string }>) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		userService
			.getMyLikedPosts()
			.then(posts => {
				setPosts(posts!);
				setIsLoading(false);
			})
			.catch(e => {
				if (isAxiosError(e)) {
					toast('Error');
				}
				setIsLoading(false);
				console.error(e);
			});
	}, []);
	return (
		<PostsDisplay posts={posts} isLoading={isLoading} className={className} />
	);
}

function ShowFollowers({
	username,
	className
}: Readonly<{ username: string; className?: string }>) {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		userService
			.getFollowers(username)
			.then(profiles => {
				setProfiles(profiles!);
				setIsLoading(false);
			})
			.catch(e => {
				if (isAxiosError(e)) {
					toast('Error');
				}
				setIsLoading(false);
				console.error(e);
			});
	}, []);
	return (
		<ProfilesDisplay
			profiles={profiles}
			isLoading={isLoading}
			className={className}
		/>
	);
}

function ShowFollowing({
	username,
	className
}: Readonly<{ username: string; className?: string }>) {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		userService
			.getFollowing(username)
			.then(profiles => {
				setProfiles(profiles!);
				setIsLoading(false);
			})
			.catch(e => {
				if (isAxiosError(e)) {
					toast('Error');
				}
				setIsLoading(false);
				console.error(e);
			});
	}, []);
	return (
		<ProfilesDisplay
			profiles={profiles}
			isLoading={isLoading}
			className={className}
		/>
	);
}

function Loader({ className }: Readonly<{ className?: string }>) {
	return (
		<div
			className={cn(
				'w-full h-full flex justify-center items-center',
				className
			)}
		>
			<ProfileSkeleton className="w-1/4" />
			<DisplaySkeleton className="w-3/4" />
		</div>
	);
}

function ProfileSkeleton({ className }: Readonly<{ className?: string }>) {
	return (
		<div className={cn('w-full h-full p-2 flex flex-col gap-2', className)}>
			<div className="h-1/5 w-full relative">
				<div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-3/4 h-1/2 aspect-square rounded-full overflow-clip">
					<Skeleton className="h-full w-full" />
				</div>
			</div>
			<div className="mt-16">
				<div className="p-4 space-y-3">
					<Skeleton className="h-4 w-2/5" />
					<Skeleton className="h-3 w-3/5" />
				</div>
				<div className="p-4 space-y-3">
					<Skeleton className="h-4 w-2/5" />
					<Skeleton className="h-3 w-3/5" />
				</div>
				<div className="p-4 space-y-3">
					<Skeleton className="h-4 w-2/5" />
					<Skeleton className="h-3 w-3/5" />
				</div>
				<div className="p-4 space-y-3">
					<Skeleton className="h-4 w-2/5" />
					<Skeleton className="h-3 w-3/5" />
				</div>
			</div>
			<div className="flex gap-5 p-4 justify-center">
				<Skeleton className="h-10 aspect-square" />
				<Skeleton className="h-10 aspect-square" />
				<Skeleton className="h-10 aspect-square" />
			</div>
			<Skeleton className="h-10 aspect-video" />
		</div>
	);
}

function DisplaySkeleton({ className }: Readonly<{ className?: string }>) {
	return (
		<div className={cn('w-full h-full p-2 flex flex-col', className)}>
			<div className="flex gap-4 items-center h-16">
				<Skeleton className="h-7 w-20" />
				<Skeleton className="h-7 w-20" />
				<Skeleton className="h-7 w-20" />
			</div>
			<div className="h-full overflow-clip p-2 grid grid-cols-4 gap-5">
				{[...Array(8)].map((_, i) => (
					<PostCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}
