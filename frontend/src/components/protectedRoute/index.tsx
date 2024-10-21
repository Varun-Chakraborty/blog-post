import { checkIfCurrentIsGuestProfile } from '@/hooks/checkIfCurrentIsGuestProfile';
import { Link } from 'react-router-dom';
import { useToast } from '../ui/use-toast';

export function ProtectedRoute({
  children
}: Readonly<{ children: JSX.Element }>) {
  const isItGuest = checkIfCurrentIsGuestProfile();
  const { toast } = useToast();
  if (isItGuest) {
    toast({
      title: 'Protected route',
      description: 'You are not logged in.',
      variant: 'destructive'
    });
    return (
      <div className="">
        <div>Nah! You need to log in for this.</div>
        <Link to="/login">Login</Link>
      </div>
    );
  } else {
    return children;
  }
}
