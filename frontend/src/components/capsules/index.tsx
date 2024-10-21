import { cn } from '@/lib/utils';
import { Capsule } from '@/components/capsules/capsule';

interface Props {
  className?: string;
}

export function AdminCapsule({ className }: Readonly<Props>) {
  return (
    <>
      <Capsule
        tooltipText="This User is admin"
        className={cn(
          'border-amber-500 text-amber-500 hover:bg-amber-600 hover:text-white sm:hidden xl:block',
          className
        )}
      >
        admin
      </Capsule>
      <Capsule
        tooltipText="This User is admin"
        className={cn(
          'border-amber-500 text-amber-500 hover:bg-amber-600 hover:text-white sm:block xl:hidden hidden',
          className
        )}
      >
        a
      </Capsule>
    </>
  );
}

export function PremiumCapsule({ className }: Readonly<Props>) {
  return (
    <>
      <Capsule
        tooltipText="This User is admin"
        className={cn(
          'border-emerald-500 text-emerald-500 hover:bg-emerald-600 hover:text-white sm:hidden xl:block',
          className
        )}
      >
        premium
      </Capsule>
      <Capsule
        tooltipText="This User is admin"
        className={cn(
          'border-emerald-500 text-emerald-500 hover:bg-emerald-600 hover:text-white sm:block xl:hidden hidden',
          className
        )}
      >
        p
      </Capsule>
    </>
  );
}
