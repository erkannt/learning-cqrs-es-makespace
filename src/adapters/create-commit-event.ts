import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Database } from 'sqlite';
import { Event, EventCodec } from '../events';
import { connectToDatabase, createTableIfNecessary } from './database';

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

export const createCommitEvent =
  () =>
  (event: Event): TE.TaskEither<unknown, unknown> =>
    pipe(
      connectToDatabase,
      TE.chainFirst(createTableIfNecessary),
      TE.chain(writeEvent(event._type, EventCodec.encode(event))),
      TE.mapLeft((e) => {
        console.log('ERROR: commitEvent', e);
        return e;
      }),
    );
