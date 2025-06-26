import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { CiSettings } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';

export function Welcome({ className }: Readonly<{ className?: string }>) {
	const { loggedIn } = useAppSelector(state => state.profile);
	const isItGuest = loggedIn.isGuest;
	const navigate = useNavigate();
	return (
		<Card className={cn(className)}>
			<CardHeader className="text-2xl capitalize flex justify-between items-center">
				<span>Hello {loggedIn.name}</span>
				<Popover>
					<PopoverTrigger className="cursor-pointer">
						<CiSettings />
					</PopoverTrigger>
					<PopoverContent className="space-y-2">
						<span className="font-semibold">Account Settings</span>
						<hr />
						<div className="flex flex-col gap-1">
							<Button variant="link" className="w-full justify-start px-0">
								Account Info
							</Button>
							<Button variant="link" className="w-full justify-start px-0">
								Add New Account
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</CardHeader>
			<CardContent>
				<CardDescription>
					<p>Welcome!</p>
					<p>Read new ideas in your brainstorming session or post your own.</p>
					<p>
						{!isItGuest
							? 'Share your thoughts with the world.'
							: 'Login or Sign up to get started.'}
					</p>
				</CardDescription>
			</CardContent>
			<CardFooter>
				<Button
					onClick={() =>
						!isItGuest ? navigate('/post/create') : navigate('/signin')
					}
					variant="accent"
				>
					{!isItGuest ? 'Start Writing' : 'Get Started'}
				</Button>
			</CardFooter>
		</Card>
	);
}
