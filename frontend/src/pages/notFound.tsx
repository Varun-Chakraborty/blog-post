import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="h-full w-full text-gray flex justify-center items-center">
			<div className="w-3/4 flex flex-col justify-center items-center gap-5">
				<span className="text-5xl font-bold">404</span>
				<span className="text-primary/80 text-center">
					<p className="text-lg font-medium">
						Oops! The page you&apos;re looking for doesn&apos;t exist.
					</p>
					<p>It might have been moved or deleted.</p>
				</span>
				<div className="flex justify-center gap-10">
					<Button onClick={() => navigate(-1)} variant="accent">
						Go to Previous Page
					</Button>
					<Button onClick={() => navigate('/')} variant="accent">
						Go Home
					</Button>
				</div>
			</div>
		</div>
	);
}
