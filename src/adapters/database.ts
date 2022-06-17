import * as TE from 'fp-ts/TaskEither';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { Event } from '../events';

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
