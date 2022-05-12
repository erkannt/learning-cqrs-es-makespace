import {pipe} from 'fp-ts/lib/function';
import {
  arbitraryPracticalScheduled,
  PracticalScheduled,
} from '../../events/practical-scheduled';
import {renderAvailablePracticals} from './render-available-practicals';
import {renderPage} from './render-page';
import * as RA from 'fp-ts/ReadonlyArray';

const availablePracticals = (events: ReadonlyArray<PracticalScheduled>) =>
  pipe(
    events,
    RA.map(event => ({
      title: event.title,
      freeSlots: event.capacity,
      date: event.date,
      duration: event.duration,
    }))
  );

export const home = pipe(
  [
    arbitraryPracticalScheduled(),
    arbitraryPracticalScheduled(),
    arbitraryPracticalScheduled(),
  ],
  availablePracticals,
  renderAvailablePracticals,
  renderPage
);
