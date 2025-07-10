import { server } from './server';
import { getRedisClient, getEmailInstance } from './services';

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  getRedisClient();
  getEmailInstance();
  console.log(`Listening on port ${port}`);
});
