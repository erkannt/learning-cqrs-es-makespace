/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import path from 'path';
import { Database } from 'sqlite';
import {
  connectToDatabase,
  createGetHistory,
  createTableIfNecessary,
} from './adapters';
import { scheduleArbitraryPractical } from './api/schedule-arbitrary-practical';
import { Event, EventCodec } from './events';
import { home } from './pages/home';
import { schedulePractical } from './pages/schedule-practical';

const app: Application = express();
const port = 8080;

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
  getHistory: createGetHistory(),
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
