import { PostsDisplay } from '@/components/postsDisplay';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { postService } from '@/services';
import type { Post } from '@/types/baseTypes';
import { useEffect, useState, type MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Capsule({
	onClick,
	children,
	className
}: Readonly<{
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: React.ReactNode;
	className?: string;
}>) {
	return (
		<Button
			onClick={onClick}
			variant="secondary"
			className={cn('rounded-full px-3 hover:bg-secondary/70', className)}
		>
			{children}
		</Button>
	);
}

export function Home({ className }: Readonly<{ className?: string }>) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const isLoggedIn = useAppSelector(state => !state.profile.loggedIn.isGuest);
	const navigate = useNavigate();
	useEffect(() => {
		postService
			.getPosts()
			.then(res => {
				setPosts(res!);
				setIsLoading(false);
			})
			.catch(e => {
				console.error(e);
				toast('Error');
			});
	}, []);
	return (
		<div className="h-full w-full flex flex-col">
			{isLoggedIn && (
				<div className="p-2 flex items-center gap-2 md:hidden">
					<span className="shrink-0">Suggested Topics:</span>
					<div className="flex p-2 gap-1 overflow-x-auto">
						{['Technology', 'Politics', 'Entertainment', 'Science'].map(
							topic => (
								<Capsule
									key={topic}
									onClick={() => navigate(`/topics/${topic.toLowerCase()}`)}
								>
									{topic}
								</Capsule>
							)
						)}
					</div>
				</div>
			)}
			<div className={cn('p-2 h-full w-full overflow-y-auto', className)}>
				<PostsDisplay posts={posts} isLoading={isLoading} />
			</div>
		</div>
	);
}
