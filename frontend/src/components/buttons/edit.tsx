import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { RiEditLine } from 'react-icons/ri';

export function Edit({
	onClick,
	className
}: Readonly<{
	onClick?: () => void;
	className?: string;
}>) {
	return (
		<Button
			onClick={onClick}
			className={cn(
				'bg-yellow-600 hover:bg-yellow-600/80 dark:bg-yellow-500 dark:hover:bg-yellow-500/80 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 font-montserrat',
				className
			)}
		>
			<RiEditLine />
		</Button>
	);
}
