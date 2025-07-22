import { FollowButton } from '@/components/buttons';
import { PostsDisplay } from '@/components/postsDisplay';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { postService, userService } from '@/services';
import type { Post, Profile, User } from '@/types/baseTypes';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function Profile({ className }: Readonly<{ className?: string }>) {
	const location = useLocation();
	const params = useParams();
	const username = params.username!;
	const [user, setUser] = useState<User | undefined>(undefined);
	const [posts, setPosts] = useState<Post[]>([]);
	const loggedInUser = useAppSelector(state => state.profile.loggedIn);
	const isItMe = loggedInUser?.username === user?.username;
	const navigate = useNavigate();

	useEffect(() => {
		userService.getProfile(username).then(res => setUser(res));
		postService.getPostsByUsername(username).then(res => setPosts(res!));
		setUser(user);
	}, [location]);

	return (
		user && (
			<div
				className={cn(
					'h-full w-full p-2 flex flex-col overflow-hidden',
					className
				)}
			>
				<section className="h-1/4 p-5 flex justify-between items-center shrink-0">
					<div className="h-full w-full flex items-center gap-5">
						<img
							className="h-20 w-20 rounded-full object-cover object-top-left"
							src={user.profilePicture ?? '/placeholder-user.jpg'}
							alt=""
						/>
						<div>
							<p className="font-semibold">{user.name}</p>
							<p>@{user.username}</p>
						</div>
					</div>
					<div className="space-y-4">
						<div className="flex gap-5">
							{[
								{ count: user._count.followers, name: 'Followers' },
								{ count: user._count.following, name: 'Following' },
								{ count: user._count.posts, name: 'Posts' }
							].map(property => (
								<div>
									<div className="text-center text-lg">{property.count}</div>
									<div>{property.name}</div>
								</div>
							))}
						</div>
						{isItMe ? (
							<div className="flex items-center gap-2 ">
								<Button
									variant="accent"
									onClick={() => navigate('/post/create')}
								>
									Post
								</Button>
								<Button>Edit Profile</Button>
							</div>
						) : (
							<FollowButton user={user} className="rounded-lg w-full" />
						)}
					</div>
				</section>
				<hr />
				<section className="h-3/4">
					<div className="p-2 font-semibold text-xl">Posts</div>
					<PostsDisplay
						author={{ ...user, followed: true }}
						posts={posts}
						isLoading={false}
						className="overflow-y-auto h-full p-2"
					/>
				</section>
			</div>
		)
	);
}
