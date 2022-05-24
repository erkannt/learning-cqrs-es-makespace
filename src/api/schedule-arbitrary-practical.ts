import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Event, arbitraryPracticalScheduled } from '../events';

type Ports = {
  commitEvent: (event: Event) => TE.TaskEither<unknown, unknown>;
};

export const scheduleArbitraryPractical = (ports: Ports) =>
  pipe(arbitraryPracticalScheduled(), ports.commitEvent);
