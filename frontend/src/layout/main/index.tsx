import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function MainPanel({ className }: Readonly<{ className?: string }>) {
	return (
		<div className={cn('w-full h-full overflow-y-auto', className)}>
			<Outlet />
		</div>
	);
}
