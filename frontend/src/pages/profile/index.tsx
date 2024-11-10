import { userService } from '@/services';
import { InfiniteLoader } from '@/components/loaders';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector, isGuestProfile } from '@/hooks';
import { cn } from '@/lib/utils';
import { profileActions } from '@/redux/profile';
import { AxiosError, isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Post, Profile as ProfileType, User } from '@/types/baseTypes';
import { UserProfile } from './userProfile';
import { NotFound } from './notFound';
import { NetworkError } from '@/components/networkError';
import { Separator } from '@/components/ui/separator';
import { PostsDisplay } from '@/components/postsDisplay';
import { FollowButton } from '@/components/buttons';
import { EditProfile } from '@/components/buttons/editProfile';
import { ProfilesDisplay } from '@/components/profilesDisplay';

export function Profile({ className }: Readonly<{ className?: string }>) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { toast } = useToast();
  const { username } = useParams();
  const { profile } = useAppSelector(state => state.profile);
  const isItMyProfile = username === 'me' || username === profile.username;
  const [loading, setLoading] = useState(true);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = !isGuestProfile();

  useEffect(() => {
    setLoading(true);
    userService
      .getProfile(username!)
      .then(profile => {
        setUser(profile);
      })
      .catch(err => {
        if (err instanceof AxiosError) {
          console.error(err.response);
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
          }
          setIsNetworkError(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const renderLoader = loading ? <InfiniteLoader /> : null;
  const renderNetworkError = isNetworkError ? <NetworkError /> : null;

  return (
    <div className={cn('h-full w-full box-border p-3', className)}>
      {renderLoader ??
        renderNetworkError ??
        (user ? (
          <UserComponent
            user={user}
            isItMyProfile={isItMyProfile}
            isLoggedIn={isLoggedIn}
          />
        ) : (
          <NotFound />
        ))}
    </div>
  );
}

function UserComponent({
  user,
  isItMyProfile,
  isLoggedIn
}: Readonly<{ user: User; isItMyProfile: boolean; isLoggedIn: boolean }>) {
  const currentSection = useParams().section as
    | 'posts'
    | 'likes'
    | 'followers'
    | 'following';
  const navigate = useNavigate();
  const sections = {
    posts: <ShowPosts username={user.username} />,
    likes: <ShowLikes />,
    followers: <ShowFollowers username={user.username} />,
    following: <ShowFollowing username={user.username} />
  };
  return (
    <div className="h-full w-full">
      <div className={`h-[calc(min(20%, 200px))] bg-[url(${user.banner})]`} />
      <div className="flex h-full">
        <UserProfile user={user} />
        <Separator orientation="vertical" className="h-full" />
        <div className="w-full">
          <div className="flex pb-2 justify-between items-center">
            <ul className="flex gap-4 pl-5">
              {[
                { title: 'Posts', onClick: () => navigate('?section=posts') },
                { title: 'Likes', onClick: () => navigate('?section=likes') },
                {
                  title: 'Followers',
                  onClick: () => navigate('?section=followers')
                },
                {
                  title: 'Following',
                  onClick: () => navigate('?section=following')
                }
              ].map(menu => (
                <li className="relative" key={menu.title}>
                  <button
                    className={cn(
                      'p-2 hover:bg-primary/20 transition-all duration-300 rounded',
                      {
                        'borber-b-2 border-primary':
                          menu.title === currentSection,
                        hidden: menu.title === 'Likes' && !isItMyProfile
                      }
                    )}
                    onClick={menu.onClick}
                  >
                    {menu.title}
                  </button>
                </li>
              ))}
            </ul>
            {isLoggedIn && isItMyProfile ? (
              <EditProfile />
            ) : (
              <FollowButton isLoggedIn={isLoggedIn} user={user} />
            )}
          </div>
          <Separator />
          <div className="p-2">{sections[currentSection]}</div>
        </div>
      </div>
    </div>
  );
}

function ShowPosts({
  username,
  className
}: Readonly<{ username: string; className?: string }>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  useEffect(() => {
    userService
      .getPostsByUsername(username)
      .then(posts => {
        setPosts(posts!);
        setIsLoading(false);
      })
      .catch(e => {
        if (isAxiosError(e)) {
          toast({
            title: 'Error',
            description: e.response?.data.message,
            variant: 'destructive'
          });
        }
        setIsLoading(false);
        console.error(e);
      });
  }, []);
  return (
    <PostsDisplay posts={posts} isLoading={isLoading} className={className} />
  );
}

function ShowLikes({ className }: Readonly<{ className?: string }>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  useEffect(() => {
    userService
      .getMyLikedPosts()
      .then(posts => {
        setPosts(posts!);
        setIsLoading(false);
      })
      .catch(e => {
        if (isAxiosError(e)) {
          toast({
            title: 'Error',
            description: e.response?.data.message
          });
        }
        setIsLoading(false);
        console.error(e);
      });
  }, []);
  return (
    <PostsDisplay posts={posts} isLoading={isLoading} className={className} />
  );
}

function ShowFollowers({
  username,
  className
}: Readonly<{ username: string; className?: string }>) {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  useEffect(() => {
    userService
      .getFollowers(username)
      .then(profiles => {
        setProfiles(profiles!);
        setIsLoading(false);
      })
      .catch(e => {
        if (isAxiosError(e)) {
          toast({
            title: 'Error',
            description: e.response?.data.message
          });
        }
        setIsLoading(false);
        console.error(e);
      });
  }, []);
  return (
    <ProfilesDisplay
      profiles={profiles}
      isLoading={isLoading}
      className={className}
    />
  );
}

function ShowFollowing({
  username,
  className
}: Readonly<{ username: string; className?: string }>) {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  useEffect(() => {
    userService
      .getFollowing(username)
      .then(profiles => {
        setProfiles(profiles!);
        setIsLoading(false);
      })
      .catch(e => {
        if (isAxiosError(e)) {
          toast({
            title: 'Error',
            description: e.response?.data.message
          });
        }
        setIsLoading(false);
        console.error(e);
      });
  }, []);
  return (
    <ProfilesDisplay
      profiles={profiles}
      isLoading={isLoading}
      className={className}
    />
  );
}
