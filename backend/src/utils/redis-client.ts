import  { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

let redisClient: RedisClientType
let isReady: boolean


const cacheOptions = {
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        tls: false
    },
}


async function getCache(): Promise<RedisClientType> {
    const port = Number(process.env.REDIS_PORT);
  
    if (isNaN(port) || port <= 0 || port >= 65536) {
        logger.error(`Invalid Redis port: ${process.env.REDIS_PORT}`);
        process.exit(1);
    }
    logger.info(cacheOptions);
    if (!isReady) {
        redisClient = createClient({
            ...cacheOptions
        });
    
        redisClient.on("error", (err) => {
            logger.error(`Error in redis connection: ${err}`);
        });

        redisClient.on('ready', () => {
            isReady = true
            logger.info('Redis ready!')
        });

        await redisClient.connect();
    }

  return redisClient
}

getCache().then(connection => {
    redisClient = connection
  }).catch(err => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    logger.error({ err }, 'Failed to connect to Redis');
    process.exit(1);
  })
  

export {
  getCache,
}
