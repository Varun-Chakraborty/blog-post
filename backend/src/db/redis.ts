import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

async function ping(instance: Redis) {
	return await instance.ping();
}

export function getRedisClient() {
	if (!redisClient) {
		redisClient = new Redis({
			host: process.env.REDIS_HOST,
			port: 6379
		});

		redisClient.on('error', err => {
			console.log('Redis Client Error', err);
		});

		ping(redisClient).then(() => {
			console.log('Connected to Redis');
		});
	}
	return redisClient;
}
