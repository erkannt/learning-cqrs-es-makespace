import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Event } from '../events';
import {
  connectToDatabase,
  createTableIfNecessary,
  getAllEventRows,
} from './database';

export const createGetHistory = (): TE.TaskEither<
  unknown,
  ReadonlyArray<Event>
> =>
  pipe(
    connectToDatabase,
    TE.chainFirst(createTableIfNecessary),
    TE.chain(getAllEventRows),
    TE.map(RA.map((row) => row.event_payload)),
  );
