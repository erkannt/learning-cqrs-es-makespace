/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import { formatValidationErrors } from 'io-ts-reporters';
import path from 'path';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { scheduleArbitraryPractical } from './api/schedule-arbitrary-practical';
import { EventsCodec, arbitraryPracticalScheduled } from './events';
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

const createTableIfNecessary = (db: Database) =>
  TE.tryCatch(
    () => db.exec('CREATE TABLE IF NOT EXISTS events (col FOO)'),
    (e) => {
      console.log(e);
      return 'failed to create table';
    },
  );

const getRows = (query: string) => (db: Database) =>
  TE.tryCatch(
    () => db.all(query),
    () => 'failed to get rows',
  );

const adapters = {
  getHistory: pipe(
    connectToDatabase,
    TE.chainFirst(createTableIfNecessary),
    TE.chain(getRows('SELECT * FROM events')),
    TE.chainEitherKW(
      flow(
        EventsCodec.decode,
        E.mapLeft(formatValidationErrors),
        E.mapLeft((msgs) => msgs.join('\n')),
      ),
    ),
    TE.map(() => [
      arbitraryPracticalScheduled(),
      arbitraryPracticalScheduled(),
      arbitraryPracticalScheduled(),
    ]),
  ),
  commitEvent: () => TE.right(undefined),
};

app.get('/', async (req: Request, res: Response) => {
  res.status(200).send(await home(adapters)());
});

app.get('/schedule-practical', (req: Request, res: Response) => {
  res.status(200).send(schedulePractical);
});

app.post(
  '/schedule-arbitrary-practical',
  async (req: Request, res: Response) => {
    await scheduleArbitraryPractical(adapters)();
    res.redirect('back');
  },
);

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(port, () =>
  process.stdout.write(`Server is listening on port ${port}!\n`),
);
