import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ProfileCard } from './ProfileCard';

export function Profile() {
	const { profile } = useAppSelector(state => state.profile);

	const [openProfileList, setOpenProfileList] = useState(false);
	const profileRef = useRef<HTMLDivElement>(null);

	function toggleProfileList() {
		setOpenProfileList(prev => !prev);
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as HTMLDivElement)
			) {
				setOpenProfileList(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [profileRef]);

	return (
		<div className="h-16 relative" ref={profileRef}>
			<div
				className={cn(
					'border border-border rounded-md overflow-hidden w-full bg-card absolute z-50',
					{ 'shadow-lg': openProfileList }
				)}
			>
				<ProfileCard
					profile={profile}
					current
					key={profile.username}
					onClick={() => toggleProfileList()}
					listOpen={openProfileList}
				/>
			</div>
		</div>
	);
}
