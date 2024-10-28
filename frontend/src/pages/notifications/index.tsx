import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';

export function Notifications({ className }: Readonly<{ className?: string }>) {
  const notifications = useAppSelector(
    state => state.notification.notifications
  );
  return (
    <div className={cn('h-full w-full space-y-2 p-4', className)}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="bg-cardBackgroundColor border border-borderColor rounded-lg cursor-pointer hover:bg-primary/10 flex items-center justify-between p-2"
        >
          <div>
            <div>{notification.title}</div>
            <div className="text-sm text-secondaryText">
              {notification.description}
            </div>
          </div>
          <div className="text-sm text-secondaryText">
            {(function () {
              const date = new Date(notification.at);
              const formattedDate = date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              });
              return formattedDate;
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
