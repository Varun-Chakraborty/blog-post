import { isGuestProfile } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { useEffect } from 'react';

export function ProtectedRoute({
  children
}: Readonly<{ children: JSX.Element }>) {
  const isItGuest = isGuestProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (isItGuest) {
      toast({
        title: 'Protected route',
        description: 'You are not logged in.',
        variant: 'destructive'
      });
    }
  }, [isItGuest, toast]);
  if (isItGuest) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center text-gray">
        <div className="text-center mb-6">
          <h1 className="text-6xl font-extrabold text-gray-500 dark:text-gray-100 mb-4">
            401
          </h1>
          <span className="text-primary/80">
            <p className="text-2xl font-medium mt-8 mb-2">
              Nah! You are not logged in.
            </p>
            <p className="text-lg">Login before trying again.</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/signin')}
            className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  } else {
    return children;
  }
}
