import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';
import { IoMdTrendingUp } from 'react-icons/io';
import { Link } from 'react-router-dom';

export function Sections() {
	return (
		<div className="h-fit shrink-0 space-y-2">
			{[
				{ name: 'Home', icon: Home, url: '/' },
				{ name: 'Trending', icon: IoMdTrendingUp, url: '/trending' }
			].map(section => (
				<Link key={section.name} to={section.url}>
					<Button
						variant="link"
						className="w-full rounded-lg p-2 justify-start items-center"
					>
						<section.icon className="h-5 w-5" />
						<span>{section.name}</span>
					</Button>
				</Link>
			))}
		</div>
	);
}

export function Topics() {
	return (
		<div className="h-full">
			<span>Suggested Topics</span>
			<div className="space-y-2 p-2">
				{['India', 'Web Development', 'War Updates'].map(topic => (
					<Link
						key={topic}
						to={`/topics/${topic.toLowerCase().replace(' ', '-')}`}
					>
						<Button
							key={topic}
							variant="link"
							className="w-full rounded-lg p-2 justify-start"
						>
							{topic}
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
}

export function Abouts() {
	return (
		<div className="h-fit shrink-0 p-2 pr-0">
			{[{name: 'About The Developer', to: 'https://portfolio-seven-beta-51.vercel.app/'}].map(topic => (
				<Button
					key={topic.name}
					variant="link"
					className="w-full rounded-lg p-2 justify-start"
					asChild
				>
					<Link to={topic.to}>{topic.name}</Link>
				</Button>
			))}
		</div>
	);
}

export function LeftPanel({ className }: Readonly<{ className?: string }>) {
	return (
		<div
			className={cn(
				'sm:static fixed md:flex hidden flex-col transition-all px-3 space-y-2 select-none h-full w-1/4 shrink-0 overflow-y-auto',
				className
			)}
		>
			<Sections />
			<hr />
			<Topics />
			<hr />
			<Abouts />
		</div>
	);
}
