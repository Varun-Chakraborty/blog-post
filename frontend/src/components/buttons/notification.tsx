import { CiBellOn } from 'react-icons/ci';
import { useAppSelector } from '@/lib/hooks';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Notification({ className }: Readonly<{ className?: string }>) {
	const navigate = useNavigate();
	const unreadNotifications = useAppSelector(
		state => state.notification.unreadNotifications
	);
	return (
		<button
			name="Notifications"
			className={cn('cursor-pointer relative', className)}
			onClick={() => navigate('/notifications')}
			type="button"
		>
			<CiBellOn className="h-6 w-6" />
			<div
				className={cn(
					'w-2 h-2 bg-accent rounded-full absolute -top-1 right-0',
					{ hidden: unreadNotifications.length === 0 }
				)}
			></div>
		</button>
	);
}
