import {pipe} from 'fp-ts/lib/function';
import {arbitraryDuration} from '../../types/duration';
import {renderAvailablePracticals} from './render-available-practicals';
import {renderPage} from './render-page';

export const home = pipe(
  [
    {
      title: 'Bandsaw',
      freeSlots: 3,
      date: new Date('2011-11-18T14:54'),
      duration: arbitraryDuration(),
    },
  ],
  renderAvailablePracticals,
  renderPage
);
