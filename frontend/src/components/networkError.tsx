import api from '@/api';
import { useEffect, useState } from 'react';
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from 'react-icons/md';
import { InfiniteLoader } from './loaders';

export function NetworkError() {
  const [time, setTime] = useState(5);
  const [pingCount, setPingCount] = useState(0);
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
      api
        .ping()
        .then(() => window.location.reload())
        .catch(e => {
          console.error(e);
          setPingCount(prev => {
            setTime((prev + 2) * 5);
            return prev + 1;
          });
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
      <div className="flex gap-1">
        <p>
          Pinging the server{' '}
          <span>
            again in {time} {time === 1 ? 'second' : 'seconds'}
          </span>
          {''}
          ...
        </p>
        <InfiniteLoader />
      </div>
      <p>
        Already pinged {pingCount} {pingCount > 1 ? 'times' : 'time'}
      </p>
      <button onClick={() => {}}>Pause Ping</button>
    </div>
  );
}
