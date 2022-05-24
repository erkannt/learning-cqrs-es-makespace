/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as TE from 'fp-ts/TaskEither';
import path from 'path';
import { arbitraryPracticalScheduled } from './events/practical-scheduled';
import { home } from './pages/home';
import { schedulePractical } from './pages/schedule-practical';

const app: Application = express();
const port = 8080;

const adapters = {
  getHistory: TE.right([
    arbitraryPracticalScheduled(),
    arbitraryPracticalScheduled(),
    arbitraryPracticalScheduled(),
  ]),
};

app.get('/', async (req: Request, res: Response) => {
  res.status(200).send(await home(adapters)());
});

app.get('/schedule-practical', (req: Request, res: Response) => {
  res.status(200).send(schedulePractical);
});

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(port, () =>
  process.stdout.write(`Server is listening on port ${port}!\n`),
);
