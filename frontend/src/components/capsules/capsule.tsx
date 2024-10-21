import { cn } from '@/lib/utils';
import { Tooltip } from '../tooltip';

interface CapsuleProps {
  children: string;
  tooltipText?: string;
  className?: string;
}

export function Capsule({
  children,
  tooltipText,
  className
}: Readonly<CapsuleProps>) {
  return tooltipText ? (
    <Tooltip
      tooltipContent="This User is admin"
      className="absolute -top-9 left-1/2 -translate-x-1/2 text-nowrap"
    >
      <MainCapsule className={className}>{children}</MainCapsule>
    </Tooltip>
  ) : (
    <MainCapsule className={className}>{children}</MainCapsule>
  );
}

function MainCapsule({
  className,
  children
}: Readonly<Omit<CapsuleProps, 'tooltipText'>>) {
  return (
    <div
      className={cn('uppercase border px-2 rounded-full text-xs', className)}
    >
      {children}
    </div>
  );
}
