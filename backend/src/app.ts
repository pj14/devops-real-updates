import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import websockets from './server'
import { getCache } from './utils/redis-client';
import { logger } from './utils/logger';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;;

app.use(cors<Request>());

getCache()
  .then(() => {
    const server = app.listen(port, () => {

    console.log(`Server running at http://localhost:${port}\n\n`);
    });

    websockets(server);
  }).catch((err) => {
    logger.error('Failed to connect to Redis ', err);
    process.exit(1);
  });


app.use('/', (req, res) => {
  res.send('Hello World!');
});

