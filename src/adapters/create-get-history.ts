import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Database } from 'sqlite';
import { Event } from '../events';
import {
  EventRows,
  connectToDatabase,
  createTableIfNecessary,
  getAllEventRowsSince,
} from './database';

let history: ReadonlyArray<Event> = [];

let latestKnownTimestamp: Date = new Date('1970');

const updateHistory = (events: ReadonlyArray<Event>) => {
  history = RA.concat(events)(history);
  return T.of(undefined);
};

const updateLatestKnownTimestamp = (rows: EventRows) => {
  latestKnownTimestamp = pipe(
    rows,
    RA.last,
    O.fold(
      () => latestKnownTimestamp,
      (latestEvent) => latestEvent.timestamp,
    ),
  );
  return T.of(undefined);
};

const getNewEvents = (db: Database) =>
  getAllEventRowsSince(latestKnownTimestamp)(db);

export const createGetHistory = (): TE.TaskEither<
  unknown,
  ReadonlyArray<Event>
> =>
  pipe(
    connectToDatabase,
    TE.chainFirst(createTableIfNecessary),
    TE.chain(getNewEvents),
    TE.chainFirstTaskK(updateLatestKnownTimestamp),
    TE.map(RA.map((row) => row.event_payload)),
    TE.chainFirstTaskK(updateHistory),
    TE.map(() => history),
  );
