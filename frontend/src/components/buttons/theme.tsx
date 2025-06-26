import { CiDark, CiDesktop, CiLight } from 'react-icons/ci';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useTheme } from '@/lib/context/themeContext';

const themes = {
	light: { icon: CiLight, name: 'Light' },
	dark: { icon: CiDark, name: 'Dark' },
	system: { icon: CiDesktop, name: 'System' }
};

export function Theme({ className }: Readonly<{ className?: string }>) {
	const { theme, toggleTheme } = useTheme();
	return (
		<Button
			onClick={() => toggleTheme()}
			variant="outline"
			className={cn(className)}
		>
			{themes[theme].icon({ className: 'w-6 h-6' })}
			<span className='md:block hidden'>{themes[theme].name}</span>
		</Button>
	);
}
