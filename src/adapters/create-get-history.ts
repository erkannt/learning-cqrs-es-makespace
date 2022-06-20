import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Event } from '../events';
import {
  connectToDatabase,
  createTableIfNecessary,
  getAllEventRows,
} from './database';

let history: ReadonlyArray<Event> = [];

const updateHistory = (events: ReadonlyArray<Event>) => {
  history = RA.concat(events)(history);
  return T.of(events);
};

export const createGetHistory = (): TE.TaskEither<
  unknown,
  ReadonlyArray<Event>
> =>
  pipe(
    connectToDatabase,
    TE.chainFirst(createTableIfNecessary),
    TE.chain(getAllEventRows),
    TE.map(RA.map((row) => row.event_payload)),
    TE.chainFirstTaskK(updateHistory),
  );
