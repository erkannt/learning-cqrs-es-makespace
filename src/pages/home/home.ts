import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import {
  Event,
  PracticalScheduled,
  PracticalScheduledCodec,
} from '../../events';
import { renderAvailablePracticals } from './render-available-practicals';
import { renderPage } from './render-page';

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

type Ports = {
  getHistory: TE.TaskEither<unknown, ReadonlyArray<Event>>;
};

export const home = (ports: Ports) =>
  pipe(
    ports.getHistory,
    TE.map(RA.filter(PracticalScheduledCodec.is)),
    TE.map(availablePracticals),
    TE.map((practicals) => ({
      listOfPracticals: renderAvailablePracticals(practicals),
      count: practicals.length,
    })),
    TE.match((e) => `<h1>Oops</h1>${JSON.stringify(e)}`, renderPage),
  );
