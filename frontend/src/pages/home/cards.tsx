import { useAppSelector } from '@/hooks/redux';

function WelcomeCard() {
  const { profiles, currentProfile } = useAppSelector(state => state.profile);
  const name =
    profiles.find(profile => profile.id === currentProfile)?.name ?? 'Guest';
  return (
    <div
      className="bg-primary dark:bg-[#5F5F5F] text-white h-fit w-full p-3 rounded-lg space-y-3"
      style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
    >
      <span className="text-2xl font-montserrat capitalize">Hello {name}</span>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium aut
        velit delectus voluptatum hic ratione non eaque possimus, officia rem!
      </p>
      <button className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300">
        Start Now
      </button>
    </div>
  );
}

function RecentPosts() {
  return (
    <div
      className="border border-borderColor bg-background h-fit w-full p-3 rounded-lg space-y-3"
      style={{ boxShadow: '1px 2px 9px rgba(0, 0, 0, 0.25)' }}
    >
      <span className="text-2xl font-montserrat">Recent Posts</span>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium aut
        velit delectus voluptatum hic ratione non eaque possimus, officia rem!
      </p>
      <button className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300">
        See All
      </button>
    </div>
  );
}

export function Cards() {
  return (
    <>
      <WelcomeCard />
      <RecentPosts />
      <RecentPosts />
      <RecentPosts />
    </>
  );
}
