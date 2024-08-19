import express from 'express';
import websockets from './server'

const app = express();
const port = process.env.PORT || 5001;;

const server = app.listen(port, () => {

    console.log(`Server running at http://localhost:${port}\n\n`);
});

websockets(server);



app.use('/', (req, res) => {
  res.send('Hello World!');
});

