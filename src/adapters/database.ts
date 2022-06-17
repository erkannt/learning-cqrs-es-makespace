import * as TE from 'fp-ts/TaskEither';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

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
