/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import path from 'path';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { PracticalScheduledCodec, arbitraryPracticalScheduled } from './events';
import { home } from './pages/home';
import { schedulePractical } from './pages/schedule-practical';

const app: Application = express();
const port = 8080;

const connectToDatabase = TE.tryCatch(
  () =>
    open({
      filename: '/tmp/database.db',
      driver: sqlite3.cached.Database,
    }),
  () => 'failed to connect to database',
);

const getRows = (query: string) => (db: Database) =>
  TE.tryCatch(
    () => db.all(query),
    () => 'failed to get rows',
  );

const adapters = {
  getHistory: pipe(
    connectToDatabase,
    TE.chain(getRows('SELECT * FROM events')),
    TE.chainEitherKW(PracticalScheduledCodec.decode),
    TE.map(() => [
      arbitraryPracticalScheduled(),
      arbitraryPracticalScheduled(),
      arbitraryPracticalScheduled(),
    ]),
  ),
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
