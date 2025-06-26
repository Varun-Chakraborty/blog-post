import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

function search(query: string, navigate: NavigateFunction) {
	navigate(`/search?q=${query}`);
}

function triggerSearch(
	query: string,
	navigate: NavigateFunction,
	timeout?: NodeJS.Timeout
) {
	if (timeout) clearTimeout(timeout);
	return setTimeout(() => search(query, navigate), 300); // debounce
}

function onReload(input: HTMLInputElement) {
	if (window.location.pathname === '/search') {
		const query = new URLSearchParams(window.location.search).get('q');
		if (query) input.value = query;
	}
}

interface Props {
	className?: string;
	full?: boolean;
}

export function SearchBar({ className }: Readonly<Props>) {
	const input = useRef<HTMLInputElement | undefined>(undefined);
	const [timeout, setTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
	const navigate = useNavigate();
	useEffect(() => {
		onReload(input.current!);
		window.addEventListener('popstate', () => onReload(input.current!));
		return () => {
			window.removeEventListener('popstate', () => onReload(input.current!));
		};
	}, []);
	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				if (timeout) clearTimeout(timeout);
				search(input.current!.value, navigate);
			}}
			className={cn(
				'p-2 flex items-center border rounded-2xl px-3 py-1 gap-3 w-4/5 cursor-text',
				className
			)}
			onClick={() => input.current!.focus()}
		>
			<CiSearch />
			<input
				ref={input as React.RefObject<HTMLInputElement>}
				onChange={e => {
					e.preventDefault();
					setTimeout(triggerSearch(e.target.value, navigate, timeout));
				}}
				onFocus={e => {
					e.currentTarget.parentElement!.classList.add('border-accent');
				}}
				onBlur={e => {
					e.currentTarget.parentElement!.classList.remove('border-accent');
				}}
				type="text"
				placeholder="Search..."
				className={cn('py-1 pr-6 outline-none dark:bg-inherit')}
			/>
		</form>
	);
}
