import * as E from 'fp-ts/Either';
import {JoinPractical} from '../commands';
import {Event} from '../events';

type HasPassedRequiredQuizzes = (
  history: ReadonlyArray<Event>
) => (command: JoinPractical) => E.Either<unknown, unknown>;

export const hasPassedRequiredQuizzes: HasPassedRequiredQuizzes = () => () =>
  E.right(undefined);
