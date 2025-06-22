import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Settings({ className }: Readonly<{ className?: string }>) {
	return (
		<div className={cn('h-full w-full box-border', className)}>
			<Switch />
		</div>
	);
}

function Switch({
	on = false,
	className
}: Readonly<{ on?: boolean; className?: string }>) {
	const [isOn, setIsOn] = useState(on);
	return (
		<div
			onClick={e => {
				e.stopPropagation();
				console.log(isOn);
				setIsOn(!isOn);
			}}
			className="border cursor-pointer rounded-full aspect-[5/2] h-10 p-2 "
		>
			<div
				className={cn(
					'bg-white rounded-full h-full w-11 duration-1000 translate-x-0',
					{ 'w-full -translate-x-0': on },
					className
				)}
			/>
		</div>
	);
}
