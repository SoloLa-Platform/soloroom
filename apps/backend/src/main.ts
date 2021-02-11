/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

import soloController from './app/components/solo/soloController';

dotenv.config();

const app = express();

app.use(bodyParser.json());

// app.get('/v1/api', (req, res) => {
//   res.send({ message: 'Welcome to backend!' });
// });
app.use(soloController);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
