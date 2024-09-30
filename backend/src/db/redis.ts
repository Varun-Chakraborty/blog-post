import { Redis } from 'ioredis';

namespace global {
  export let redisClient: Redis;
}

async function ping() {
  return await global.redisClient.ping();
}

if (!global.redisClient) {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379
  });
  redisClient.on('error', err => {
    console.log('Redis Client Error', err);
  });

  global.redisClient = redisClient;
  ping().then(() => {
    console.log('Connected to Redis');
  });
}

const redisClient = global.redisClient;

export default { redisClient };
