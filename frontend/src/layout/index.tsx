import { Header } from '@/components/header';
import { LeftPanel } from './left';
import { MainPanel } from './main';
import { RightPanel } from './right';
import { FloatingMessage } from '@/components/message';
import { init } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Home, MessageCircle } from 'lucide-react';
import { CiSearch, CiSettings } from 'react-icons/ci';
import { IoNotificationsOutline } from 'react-icons/io5';
import { IoMdTrendingUp } from 'react-icons/io';

function BottomPanel({ className }: Readonly<{ className?: string }>) {
	const links = [
		{ name: 'Home', icon: Home, url: '/' },
		{ name: 'Trending', icon: IoMdTrendingUp, url: '/trending' },
		{ name: 'Search', icon: CiSearch, url: '/search' },
		{ name: 'Messages', icon: MessageCircle, url: '/chat' },
		{
			name: 'Notifications',
			icon: IoNotificationsOutline,
			url: '/notifications'
		},
		{ name: 'Settings', icon: CiSettings, url: '/settings' }
	];
	return (
		<div
			className={cn(
				'w-3/4 flex justify-between items-center md:hidden p-4 rounded-full mx-auto border',
				className
			)}
		>
			{links.map(link => (
				<Link key={link.name} to={link.url}>
					<link.icon className="h-5 w-5" />
				</Link>
			))}
		</div>
	);
}

export function Layout() {
	init();
	return (
		<main className="h-svh w-screen flex flex-col">
			<Header />
			<hr />
			<div className="flex justify-between h-full w-full overflow-y-auto">
				<LeftPanel />
				<div className="h-full w-px bg-border shrink-0" />
				<MainPanel />
				<div className="h-full w-px bg-border shrink-0" />
				<RightPanel className="hidden lg:block" />
			</div>
			<BottomPanel />
			{/* <FloatingMessage /> */}
		</main>
	);
}
