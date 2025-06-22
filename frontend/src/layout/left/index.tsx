import { cn } from '@/lib/utils';
import { TitleAndProfile } from './titleAndProfile';
import { Menu } from './menu';
import { Settings } from './settings';

interface LeftPanelProps {
	className?: string;
	isMenuOpen: boolean;
	setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LeftPanel({
	className,
	isMenuOpen,
	setMenuOpen
}: Readonly<LeftPanelProps>) {
	return (
		<div
			className={cn(
				'h-full xl:w-1/6 lg:w-1/5 sm:w-1/3 w-full sm:static fixed flex flex-col transition-all px-0 sm:p-0 z-50 bg-background select-none',
				isMenuOpen ? 'left-0' : '-left-full',
				className
			)}
		>
			<TitleAndProfile
				isMenuOpen={isMenuOpen}
				setMenuOpen={setMenuOpen}
				className="p-2"
			/>
			<hr className="border border-borderColor" />
			<Menu setMenuOpen={setMenuOpen} className="h-full overscroll-none" />
			<hr className="border border-borderColor" />
			<Settings setMenuOpen={setMenuOpen} className="overscroll-none " />
		</div>
	);
}
