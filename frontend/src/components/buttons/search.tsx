import { cn } from '@/lib/utils';
import { CiSearch } from 'react-icons/ci';

export function Search({
  className,
  onClick
}: Readonly<{ className?: string; onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      name="Search"
      type="button"
      className={cn(
        'bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 md:rounded-l-none rounded-lg shadow-lg transition duration-300',
        className
      )}
    >
      <CiSearch className="aspect-square sm:w-6 w-5" />
    </button>
  );
}
