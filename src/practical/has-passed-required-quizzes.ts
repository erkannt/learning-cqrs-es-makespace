import * as E from 'fp-ts/Either';
import {JoinPractical} from '../commands';
import {Event, PracticalScheduledCodec} from '../events';
import * as RA from 'fp-ts/ReadonlyArray';
import {pipe} from 'fp-ts/lib/function';

type HasPassedRequiredQuizzes = (
  history: ReadonlyArray<Event>
) => (command: JoinPractical) => E.Either<unknown, unknown>;

export const hasPassedRequiredQuizzes: HasPassedRequiredQuizzes =
  history => command => {
    return pipe(
      history,
      RA.filter(PracticalScheduledCodec.is),
      RA.findFirst(event => event.id === command.practicalId),
      E.fromOption(() => 'practical does not exist'),
      E.map(event => event.requiredQuizzes),
      E.chain(
        RA.match(
          () => E.right('no quizzes required'),
          () => E.left('fail by default')
        )
      )
    );
  };
