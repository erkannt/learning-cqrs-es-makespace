import * as E from 'fp-ts/Either';
import {JoinPractical} from '../commands';
import {Event, PracticalScheduledCodec, QuizPassedCodec} from '../events';
import * as RA from 'fp-ts/ReadonlyArray';
import {flow, pipe} from 'fp-ts/lib/function';
import {MemberNumber} from '../types';
import * as B from 'fp-ts/boolean';

const passedQuizzes = (
  history: ReadonlyArray<Event>,
  memberNumber: MemberNumber
) =>
  pipe(
    history,
    RA.filter(QuizPassedCodec.is),
    RA.filter(event => event.memberNumber === memberNumber),
    RA.map(event => event.quizId)
  );

type HasPassedRequiredQuizzes = (
  history: ReadonlyArray<Event>
) => (command: JoinPractical) => E.Either<unknown, unknown>;

export const hasPassedRequiredQuizzes: HasPassedRequiredQuizzes =
  history => command => {
    const required = pipe(
      history,
      RA.filter(PracticalScheduledCodec.is),
      RA.findFirst(event => event.id === command.practicalId),
      E.fromOption(() => 'practical does not exist'),
      E.map(event => event.requiredQuizzes)
    );

    const passed = passedQuizzes(history, command.memberNumber);

    return pipe(
      required,
      E.chain(
        flow(
          RA.every(req => passed.includes(req)),
          B.match(
            () => E.left('not all required quizzes passed'),
            () => E.right('all required quizzes passed')
          )
        )
      )
    );
  };
