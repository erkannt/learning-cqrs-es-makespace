import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { Event, EventCodec } from '../events';

export const connectToDatabase = TE.tryCatch(
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

export const createTableIfNecessary = (
  db: Database,
): TE.TaskEither<string, void> =>
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

type EventType = Event['_type'];

export const writeEvent =
  (type: EventType, payload: Record<string, unknown>) =>
  (db: Database): TE.TaskEither<string, unknown> =>
    TE.tryCatch(
      () =>
        db.run('INSERT INTO events (event_type, event_payload) VALUES (?, ?)', [
          type,
          JSON.stringify(payload),
        ]),
      (e) => `writeEvent failed: ${JSON.stringify(e)}`,
    );

const getRows = (query: string) => (db: Database) =>
  TE.tryCatch(
    () => db.all(query),
    (e) => {
      console.log(e);
      return 'failed to get rows';
    },
  );

const JsonFromUnknown = t.string.pipe(tt.JsonFromString);

const EventFromEncodedJson = JsonFromUnknown.pipe(EventCodec);

const EventsTableCodec = t.readonlyArray(
  t.type({
    event_payload: EventFromEncodedJson,
  }),
);

type EventRows = t.TypeOf<typeof EventsTableCodec>;

export const getAllEventRows = (
  db: Database,
): TE.TaskEither<string, EventRows> =>
  pipe(
    db,
    getRows('SELECT event_payload FROM events'),
    TE.chainEitherKW(
      flow(
        EventsTableCodec.decode,
        E.mapLeft(formatValidationErrors),
        E.mapLeft((msgs) => msgs.join('\n')),
      ),
    ),
  );
