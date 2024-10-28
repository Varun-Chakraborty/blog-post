import api from '@/api';
import { profileActions } from '@/redux/profile';
import { useToast } from '../ui/use-toast';
import { useAppDispatch } from '@/hooks';
import { isAxiosError } from 'axios';
import { cn } from '@/lib/utils';

interface Props {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export function Logout({ setMenuOpen, className }: Readonly<Props>) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={async function () {
        try {
          await api.logout();
          dispatch(profileActions.removeProfile());
          toast({
            title: 'Success',
            description: 'You have been logged out'
          });
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 401) {
            dispatch(profileActions.removeProfile());
            toast({
              title: 'Success',
              description: 'You have been logged out'
            });
            return;
          } else {
            toast({
              title: 'Error',
              description: (error as Error).message,
              variant: 'destructive'
            });
            console.error(error);
          }
        } finally {
          setMenuOpen(false);
        }
      }}
      className={cn(
        'bg-destructive hover:bg-destructive/80 text-destructive-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full',
        className
      )}
    >
      Logout
    </button>
  );
}
