import { authService } from '@/services';
import { useEffect, useState } from 'react';
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from 'react-icons/md';

export function NetworkError() {
  const [time, setTime] = useState(5);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (time > 0) {
      interval = setInterval(() => {
        setTime(time => {
          if (time === 0) {
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      authService
        .ping()
        .then(() => window.location.reload())
        .catch(e => {
          console.error(e);
        });
    }
    return () => clearInterval(interval);
  }, [time]);
  return (
    <div className="h-full w-full flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-bold flex gap-1 mb-3">
        <MdOutlineSignalWifiStatusbarConnectedNoInternet4 />
        Cannot Connect
      </h1>
      <p>Either you are offline or the server is not responding.</p>
    </div>
  );
}
