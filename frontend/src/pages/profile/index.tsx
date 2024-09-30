import api from '@/api';
import { InfiniteLoader } from '@/components/loaders';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/hooks/redux';
import { cn } from '@/lib/utils';
import { profileActions } from '@/redux/profile';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { UserProfile } from './userProfile';
import { NotFound } from './notFound';
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";

export function Profile({ className }: Readonly<{ className?: string }>) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { toast } = useToast();
  const userNameRequested = new URLSearchParams(window.location.search).get(
    'username'
  );
  const [loading, setLoading] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .getProfile(userNameRequested)
      .then(profile => {
        setUser(profile);
      })
      .catch(err => {
        if (err instanceof AxiosError) {
          console.log(err.response);
          if (err.response?.status === 401) {
            toast({
              title: 'Session expired',
              description: 'Please login again.'
            });
            dispatch(profileActions.removeProfile());
            navigate('/login');
          } else {
            toast({
              title: 'Could not get profile',
              description:
                err.response?.data.message ?? 'Unknown error occured',
              variant: 'destructive'
            });
          }
        } else {
          if (err.message !== 'Network Error') {
            toast({
              title: 'Could not get profile',
              description: 'Something went wrong. Please try again later.',
              variant: 'destructive'
            });
            return console.error(err);
          } else setIsNetworkError(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const renderLoader = loading ? <InfiniteLoader /> : null;
  const renderNetworkError = isNetworkError ? <NetworkError /> : null;

  return (
    <div className={cn('h-full w-full box-border', className)}>
      {renderLoader ??
        renderNetworkError ??
        (user ? <UserComponent user={user} /> : <NotFound />)}
    </div>
  );
}

function UserComponent({ user }: Readonly<{ user: User }>) {
  return (
    <div className="h-full w-full">
      <div className={`h-[calc(min(20%, 200px))] bg-[url(${user.banner})]`} />
      <div className="flex gap-5 h-full">
        <UserProfile user={user} />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <ul className="flex gap-4">
              <li>
                <button className="hover:bg-primary/10">Posts</button>
              </li>
              <li>
                <button className="hover:bg-primary/10">Likes</button>
              </li>
            </ul>
            <button className="bg-accent hover:bg-primary p-2 rounded">
              Follow
            </button>
          </div>
          <div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NetworkError() {
  return (
    <div className='h-full w-full flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold flex gap-1 mb-3'><MdOutlineSignalWifiStatusbarConnectedNoInternet4 />No Internet</h1>
      <p>Either you are offline or the server is not responding.</p>
    </div>
  );
}
