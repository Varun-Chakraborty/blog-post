import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import { isGuestProfile, useAppSelector } from '@/lib/hooks';
import { useNavigate } from 'react-router-dom';

function WelcomeCard() {
	const { profile } = useAppSelector(state => state.profile);
	const isItGuest = isGuestProfile();
	const navigate = useNavigate();
	return (
		<Card className="border h-fit w-full p-3 rounded-lg space-y-3">
			<CardHeader className="text-2xl font-montserrat capitalize">
				Hello {profile.name}
			</CardHeader>
			<CardContent>
				<CardDescription>
					<p>
						Welcome to blogpost, your one-stop destination for all things
						blogging.
					</p>
					<p>
						We are a community of like-minded individuals who share our love of
						writing and sharing our thoughts with the world.
					</p>
					<p>
						{!isItGuest
							? 'Share your thoughts with the world.'
							: 'Sign up or log in to get started.'}
					</p>
				</CardDescription>
			</CardContent>
			<CardFooter>
				<Button
					onClick={() =>
						!isItGuest ? navigate('/post/create') : navigate('/signin')
					}
					className="bg-accent font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300"
				>
					{!isItGuest ? 'Start Writing' : 'Get Started'}
				</Button>
			</CardFooter>
		</Card>
	);
}

function RecentPosts() {
	const navigate = useNavigate();
	return (
		<Card
			className="border h-fit w-full p-3 rounded-lg space-y-3"
			style={{ boxShadow: '1px 2px 9px rgba(0, 0, 0, 0.25)' }}
		>
			<CardHeader className="text-2xl font-montserrat">Recent Posts</CardHeader>
			<CardContent>Check out some of our most recent posts.</CardContent>
			<CardFooter>
				<Button
					onClick={() => navigate('/post')}
					className="bg-accent font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300"
				>
					See All
				</Button>
			</CardFooter>
		</Card>
	);
}

export function Cards() {
	return (
		<>
			<WelcomeCard />
			<RecentPosts />
		</>
	);
}
