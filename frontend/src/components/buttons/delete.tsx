import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { MdDelete } from 'react-icons/md';

export function Delete({
	onClick,
	className
}: Readonly<{
	onClick?: () => void;
	className?: string;
}>) {
	return (
		<Button onClick={onClick} variant="destructive" className={cn(className)}>
			<MdDelete />
		</Button>
	);
}
