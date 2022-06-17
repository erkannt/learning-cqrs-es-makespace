import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { Database } from 'sqlite';
import { Event, EventCodec } from '../events';
import { connectToDatabase, createTableIfNecessary } from './database';

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

export const createGetHistory = (): TE.TaskEither<
  unknown,
  ReadonlyArray<Event>
> =>
  pipe(
    connectToDatabase,
    TE.chainFirst(createTableIfNecessary),
    TE.chain(getRows('SELECT event_payload FROM events')),
    TE.chainEitherKW(
      flow(
        EventsTableCodec.decode,
        E.mapLeft(formatValidationErrors),
        E.mapLeft((msgs) => msgs.join('\n')),
      ),
    ),
    TE.map(RA.map((row) => row.event_payload)),
  );
