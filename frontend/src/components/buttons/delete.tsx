import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { MdDelete } from 'react-icons/md';

export function Delete({
  onClick,
  className
}: Readonly<{
  onClick?: () => void;
  className?: string;
}>) {
  return (
    <Button
      onClick={onClick}
      variant="destructive"
      className={cn(
        'font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 font-montserrat',
        className
      )}
    >
      <MdDelete />
    </Button>
  );
}
