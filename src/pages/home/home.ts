import {pipe} from 'fp-ts/lib/function';
import {renderAvailablePracticals} from './render-available-practicals';
import {renderPage} from './render-page';

export const home = pipe(
  [{title: 'Bandsaw'}],
  renderAvailablePracticals,
  renderPage
);
