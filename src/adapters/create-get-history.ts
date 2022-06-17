import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { Database } from 'sqlite';
import { Event, EventsCodec } from '../events';
import { connectToDatabase, createTableIfNecessary } from './database';

const getRows = (query: string) => (db: Database) =>
  TE.tryCatch(
    () => db.all(query),
    (e) => {
      console.log(e);
      return 'failed to get rows';
    },
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        RA.map((row) => row.event_payload),
        E.traverseArray(tt.JsonFromString.decode),
        E.chain(EventsCodec.decode),
        E.mapLeft(formatValidationErrors),
        E.mapLeft((msgs) => msgs.join('\n')),
      ),
    ),
  );
