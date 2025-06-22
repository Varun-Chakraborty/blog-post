import { Button } from '../ui/button';
import { AiOutlineMessage } from 'react-icons/ai';

export function Comment({
	commentsCount,
	onClick
}: Readonly<{
	commentsCount: number;
	onClick: () => void;
}>) {
	return (
		<Button
			onClick={onClick}
			className="bg-blue-600 hover:bg-blue-600/80 dark:bg-blue-500 dark:hover:bg-blue-500/80 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 font-montserrat"
		>
			<AiOutlineMessage />
			<span className="ml-2">{commentsCount}</span>
		</Button>
	);
}
