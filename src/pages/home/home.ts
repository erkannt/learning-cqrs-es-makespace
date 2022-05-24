import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { PracticalScheduled } from '../../events/practical-scheduled';
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
  getHistory: TE.TaskEither<unknown, ReadonlyArray<PracticalScheduled>>;
};

export const home = (ports: Ports) =>
  pipe(
    ports.getHistory,
    TE.map(availablePracticals),
    TE.map(renderAvailablePracticals),
    TE.match((e) => `<h1>Oops</h1>${JSON.stringify(e)}`, renderPage),
  );
