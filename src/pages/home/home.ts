import {pipe} from 'fp-ts/lib/function';
import {renderAvailablePracticals} from './render-available-practicals';
import {renderPage} from './render-page';

export const home = pipe(
  [
    {
      title: 'Bandsaw',
      freeSlots: 3,
      date: new Date('2011-11-18T14:54'),
      duration: {hours: 2, minutes: 30},
      trainerName: 'Alice Jones',
    },
  ],
  renderAvailablePracticals,
  renderPage
);
