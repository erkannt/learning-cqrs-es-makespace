import {pipe} from 'fp-ts/lib/function';
import {JoinPractical} from './commands';
import {practical} from './practical';
import {Event} from './events';
import * as E from 'fp-ts/Either';

const hasCompletedOnlineTraining = () => E.right(undefined);

const hasCompletedSafetyQuiz = () => E.right(undefined);

export const commandHandler =
  (history: ReadonlyArray<Event>) => (command: JoinPractical) =>
    pipe(
      command,
      E.right,
      E.chainFirst(hasCompletedOnlineTraining),
      E.chainFirst(hasCompletedSafetyQuiz),
      E.map(practical(history))
    );
