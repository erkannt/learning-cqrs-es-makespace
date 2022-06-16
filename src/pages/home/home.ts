import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import {
  Ports as GetAllPracticalsPorts,
  getAllPracticals,
} from '../../read-models/practicals';
import { renderAvailablePracticals } from './render-available-practicals';
import { renderPage } from './render-page';

type Ports = GetAllPracticalsPorts;

export const home = (ports: Ports): T.Task<string> =>
  pipe(
    getAllPracticals(ports),
    TE.map((practicals) => ({
      listOfPracticals: pipe(
        practicals,
        RA.takeLeft(10),
        renderAvailablePracticals,
      ),
      practicalCount: practicals.length,
    })),
    TE.match((e) => `<h1>Oops</h1>${JSON.stringify(e)}`, renderPage),
  );
