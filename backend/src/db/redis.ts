import { Redis } from 'ioredis';

declare global {
  var redisClient: Redis;
}

async function ping(instance: Redis) {
  return await instance.ping();
}

if (!globalThis.redisClient) {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379
  });
  redisClient.on('error', err => {
    console.log('Redis Client Error', err);
  });

  globalThis.redisClient = redisClient;
  ping(globalThis.redisClient).then(() => {
    console.log('Connected to Redis');
  });
}

const redisClient = global.redisClient;

export default { redisClient };
