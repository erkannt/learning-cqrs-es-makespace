/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import path from 'path';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { scheduleArbitraryPractical } from './api/schedule-arbitrary-practical';
import { Event, EventCodec, EventsCodec } from './events';
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
  (e) => {
    console.log(e);
    return 'failed to connect to database';
  },
);

const createTableIfNecessary = (db: Database) =>
  TE.tryCatch(
    () =>
      db.exec(
        'CREATE TABLE IF NOT EXISTS events (event_type TEXT, event_payload TEXT)',
      ),
    (e) => {
      console.log(e);
      return 'failed to create table';
    },
  );

const getRows = (query: string) => (db: Database) =>
  TE.tryCatch(
    () => db.all(query),
    (e) => {
      console.log(e);
      return 'failed to get rows';
    },
  );

type EventType = Event['_type'];

const writeEvent =
  (type: EventType, payload: Record<string, unknown>) => (db: Database) =>
    TE.tryCatch(
      () =>
        db.run('INSERT INTO events (event_type, event_payload) VALUES (?, ?)', [
          type,
          JSON.stringify(payload),
        ]),
      (e) => `writeEvent failed: ${JSON.stringify(e)}`,
    );

const adapters = {
  getHistory: pipe(
    connectToDatabase,
    TE.chainFirst(createTableIfNecessary),
    TE.chain(getRows('SELECT event_payload FROM events')),
    TE.chainEitherKW(
      flow(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        RA.map((row) => row.event_payload),
        E.traverseArray(tt.JsonFromString.decode),
        E.chain(EventsCodec.decode),
        E.mapLeft(formatValidationErrors),
        E.mapLeft((msgs) => msgs.join('\n')),
      ),
    ),
  ),
  commitEvent: (event: Event) =>
    pipe(
      connectToDatabase,
      TE.chainFirst(createTableIfNecessary),
      TE.chain(writeEvent(event._type, EventCodec.encode(event))),
      TE.mapLeft((e) => {
        console.log('ERROR: commitEvent', e);
        return e;
      }),
    ),
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
