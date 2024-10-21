import { server } from './server';
import { io as socketServer } from './socket';

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
