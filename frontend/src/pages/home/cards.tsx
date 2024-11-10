import { Button } from '@/components/ui/button';
import { isGuestProfile, useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';

function WelcomeCard() {
  const { profile } = useAppSelector(state => state.profile);
  const isItGuest = isGuestProfile();
  const navigate = useNavigate();
  return (
    <div
      className="bg-primary dark:bg-[#5F5F5F] text-white h-fit w-full p-3 rounded-lg space-y-3"
      style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
    >
      <span className="text-2xl font-montserrat capitalize">
        Hello {profile.name}
      </span>
      <p>
        Welcome to blogpost, your one-stop destination for all things blogging.
      </p>
      <p>
        We are a community of like-minded individuals who share our love of
        writing and sharing our thoughts with the world.
      </p>
      <p>
        {!isItGuest
          ? 'Share your thoughts with the world.'
          : 'Sign up or log in to get started.'}
      </p>
      <Button
        onClick={() =>
          !isItGuest ? navigate('/post/create') : navigate('/signin')
        }
        className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300"
      >
        {!isItGuest ? 'Start Writing' : 'Get Started'}
      </Button>
    </div>
  );
}

function RecentPosts() {
  const navigate = useNavigate();
  return (
    <div
      className="border border-borderColor bg-background h-fit w-full p-3 rounded-lg space-y-3"
      style={{ boxShadow: '1px 2px 9px rgba(0, 0, 0, 0.25)' }}
    >
      <span className="text-2xl font-montserrat">Recent Posts</span>
      <p>Check out some of our most recent posts.</p>
      <Button
        onClick={() => navigate('/post')}
        className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300"
      >
        See All
      </Button>
    </div>
  );
}

export function Cards() {
  return (
    <>
      <WelcomeCard />
      <RecentPosts />
    </>
  );
}
