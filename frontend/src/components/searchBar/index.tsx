import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import { NavigateFunction, useNavigate } from 'react-router-dom';

function triggerSearch(query: string, navigate: NavigateFunction) {
  navigate(`/search?q=${query}`);
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

export function SearchBar({ className, full = false }: Readonly<Props>) {
  const input = useRef<HTMLInputElement | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    onReload(input.current!);
    window.addEventListener('popstate', () => onReload(input.current!));
    return () => {
      window.removeEventListener('popstate', () => onReload(input.current!));
      if (input.current) input.current.value = '';
    };
  }, []);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        triggerSearch(input.current!.value, navigate);
      }}
      className={cn('p-2 flex', className)}
    >
      <input
        ref={input as React.RefObject<HTMLInputElement>}
        onChange={e => {
          e.preventDefault();
          triggerSearch(e.target.value, navigate);
        }}
        type="text"
        name=""
        id=""
        placeholder="Search..."
        className={cn(
          'py-1 px-6 border border-border outline-none rounded-l-lg md:block hidden dark:bg-inherit',
          { block: full }
        )}
      />
      <button
        name="Search"
        onClick={() => triggerSearch(input.current!.value, navigate)}
        className={cn(
          'bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 md:rounded-l-none rounded-lg shadow-lg transition duration-300',
          { 'rounded-l-none': full }
        )}
      >
        <CiSearch className="aspect-square sm:w-6 w-5" />
      </button>
    </form>
  );
}
