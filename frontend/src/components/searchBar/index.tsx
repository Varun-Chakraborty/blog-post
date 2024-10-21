import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { NavigateFunction, useNavigate } from 'react-router-dom';

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
      className={cn('p-2 flex', className)}
    >
      <input
        ref={input as React.RefObject<HTMLInputElement>}
        onChange={e => {
          e.preventDefault();
          setTimeout(triggerSearch(e.target.value, navigate, timeout));
        }}
        type="text"
        placeholder="Search..."
        className={cn(
          'py-1 px-6 border border-border outline-none rounded-l-lg dark:bg-inherit'
        )}
      />
      <button
        name="Search"
        type="submit"
        className={cn(
          'bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg rounded-l-none shadow-lg transition duration-300'
        )}
      >
        <CiSearch className="aspect-square sm:w-6 w-5" />
      </button>
    </form>
  );
}
