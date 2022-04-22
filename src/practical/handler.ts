import {pipe} from 'fp-ts/lib/function';
import {JoinPractical} from './join-practical';
import {practical} from './practical';
import {Event} from '../events';
import * as E from 'fp-ts/Either';
import {hasPassedRequiredQuizzes} from './has-passed-required-quizzes';

export const commandHandler =
  (history: ReadonlyArray<Event>) => (command: JoinPractical) =>
    pipe(
      command,
      E.right,
      E.chainFirst(hasPassedRequiredQuizzes(history)),
      E.map(practical(history))
    );
