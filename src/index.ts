/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import path from 'path';
import { createCommitEvent, createGetHistory } from './adapters';
import { scheduleArbitraryPractical, schedulePractical } from './api';
import { home } from './pages/home';
import { schedulePractical as schedulePracticalPage } from './pages/schedule-practical';

const app: Application = express();
const port = 8080;

const adapters = {
  getHistory: createGetHistory(),
  commitEvent: createCommitEvent(),
};

app.get('/', async (req: Request, res: Response) => {
  res.status(200).send(await home(adapters)());
});

app.get('/schedule-practical', (req: Request, res: Response) => {
  res.status(200).send(schedulePracticalPage);
});

app.post('/schedule-practical', async (req: Request, res: Response) => {
  await pipe(
    schedulePractical(),
    TE.match(
      (e) => res.status(500).send(e),
      (r) => res.status(200).send(r),
    ),
  )();
});

app.post(
  '/schedule-arbitrary-practical',
  async (req: Request, res: Response) => {
    await pipe(
      scheduleArbitraryPractical(adapters),
      TE.match(
        (e) => res.status(500).send(e),
        () => res.redirect('back'),
      ),
    )();
  },
);

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(port, () =>
  process.stdout.write(`Server is listening on port ${port}!\n`),
);
