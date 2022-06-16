import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import {
  Event,
  PracticalScheduled,
  PracticalScheduledCodec,
} from '../../events';
import { Duration } from '../../types/duration';

type Practical = {
  title: string;
  freeSlots: number;
  date: Date;
  duration: Duration;
};

const availablePracticals = (events: ReadonlyArray<PracticalScheduled>) =>
  pipe(
    events,
    RA.map((event) => ({
      title: event.title,
      freeSlots: event.capacity,
      date: event.date,
      duration: event.duration,
    })),
  );

export type Ports = {
  getHistory: TE.TaskEither<unknown, ReadonlyArray<Event>>;
};

export const getAllPracticals = (
  ports: Ports,
): TE.TaskEither<unknown, ReadonlyArray<Practical>> =>
  pipe(
    ports.getHistory,
    TE.map(RA.filter(PracticalScheduledCodec.is)),
    TE.map(availablePracticals),
  );
