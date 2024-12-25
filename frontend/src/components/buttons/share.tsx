import { Button } from '../ui/button';
import { IoIosSend } from 'react-icons/io';

export function Share({}: {}) {
  return (
    <Button className="bg-green-600 hover:bg-green-600/80 dark:bg-green-500 dark:hover:bg-green-500/80 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 font-montserrat">
      <IoIosSend />
    </Button>
  );
}
