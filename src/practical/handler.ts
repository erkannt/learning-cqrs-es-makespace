import {pipe} from 'fp-ts/lib/function';
import {JoinPractical} from '../commands';
import {practical} from './practical';
import {Event} from '../events';
import * as E from 'fp-ts/Either';
import {hasCompletedOnlineTraining} from './has-completed-online-training';
import {hasCompletedSafetyQuiz} from './has-completed-safety-quiz';

export const commandHandler =
  (history: ReadonlyArray<Event>) => (command: JoinPractical) =>
    pipe(
      command,
      E.right,
      E.chainFirst(hasCompletedOnlineTraining),
      E.chainFirst(hasCompletedSafetyQuiz),
      E.map(practical(history))
    );
