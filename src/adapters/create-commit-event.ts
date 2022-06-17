import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Event, EventCodec } from '../events';
import {
  connectToDatabase,
  createTableIfNecessary,
  writeEvent,
} from './database';

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
