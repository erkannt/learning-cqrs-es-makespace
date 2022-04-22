import express, {Application, Request, Response} from 'express';
import path from 'path';
import {home} from './pages/home';
import {schedulePractical} from './pages/schedule-practical';

const app: Application = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(home);
});

app.get('/schedule-practical', (req: Request, res: Response) => {
  res.status(200).send(schedulePractical);
});

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(port, () =>
  process.stdout.write(`Server is listening on port ${port}!\n`)
);
