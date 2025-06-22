import { cn } from '@/lib/utils';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

interface Props {
	isMenuOpen: boolean;
	setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
}

export function Logo({ isMenuOpen, setMenuOpen, className }: Readonly<Props>) {
	const navigate = useNavigate();
	return (
		<div
			className={cn(
				'font-montserrat text-xl font-bold flex gap-4 p-2 items-center',
				className
			)}
		>
			<RxHamburgerMenu
				className={cn(
					'w-5 h-5 transition sm:hidden',
					isMenuOpen ? 'rotate-90' : ''
				)}
				onClick={() => setMenuOpen(!isMenuOpen)}
			/>
			<button
				className="uppercase"
				onClick={() => {
					navigate('/');
					setMenuOpen(false);
				}}
			>
				Blog Post
			</button>
		</div>
	);
}
