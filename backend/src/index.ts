import { server } from './server';
import { getRedisClient } from './db';

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  getRedisClient();
  console.log(`Listening on port ${port}`);
});
