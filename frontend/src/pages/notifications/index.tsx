import { cn } from '@/lib/utils';

const notifications = [
  {
    id: 1,
    title: 'Notification 1',
    description: 'Description 1',
    at: '2022-01-01 00:00:00'
  },
  {
    id: 2,
    title: 'Notification 2',
    description: 'Description 2',
    at: '2022-01-01 00:00:00'
  },
  {
    id: 3,
    title: 'Notification 3',
    description: 'Description 3',
    at: '2022-01-01 00:00:00'
  }
];

export function Notifications({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('h-full w-full space-y-2', className)}>
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
