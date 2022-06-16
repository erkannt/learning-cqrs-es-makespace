import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
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

export const home = (ports: Ports): T.Task<string> =>
  pipe(
    ports.getHistory,
    TE.map((events) => ({
      practicals: pipe(
        events,
        RA.filter(PracticalScheduledCodec.is),
        availablePracticals,
      ),
    })),
    TE.map(({ practicals }) => ({
      listOfPracticals: pipe(
        practicals,
        RA.takeLeft(10),
        renderAvailablePracticals,
      ),
      practicalCount: practicals.length,
    })),
    TE.match((e) => `<h1>Oops</h1>${JSON.stringify(e)}`, renderPage),
  );
