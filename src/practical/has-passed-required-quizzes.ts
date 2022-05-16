import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { sequenceS } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { Event, PracticalScheduledCodec, QuizPassedCodec } from '../events';
import { MemberNumber, PracticalId } from '../types';
import { JoinPractical } from './join-practical';

const passedQuizzes = (
  history: ReadonlyArray<Event>,
  memberNumber: MemberNumber,
) =>
  pipe(
    history,
    RA.filter(QuizPassedCodec.is),
    RA.filter((event) => event.memberNumber === memberNumber),
    RA.map((event) => event.quizId),
  );

const requiredQuizzes = (
  history: ReadonlyArray<Event>,
  practicalId: PracticalId,
) =>
  pipe(
    history,
    RA.filter(PracticalScheduledCodec.is),
    RA.findFirst((event) => event.id === practicalId),
    E.fromOption(() => 'practical does not exist'),
    E.map((event) => event.requiredQuizzes),
  );

type HasPassedRequiredQuizzes = (
  history: ReadonlyArray<Event>,
) => (command: JoinPractical) => E.Either<unknown, unknown>;

export const hasPassedRequiredQuizzes: HasPassedRequiredQuizzes =
  (history) => (command) =>
    pipe(
      {
        required: requiredQuizzes(history, command.practicalId),
        passed: E.right(passedQuizzes(history, command.memberNumber)),
      },
      sequenceS(E.Apply),
      E.chain(({ required, passed }) =>
        pipe(
          required,
          RA.every((req) => passed.includes(req)),
          B.match(
            () => E.left('not all required quizzes passed'),
            () => E.right('all required quizzes passed'),
          ),
        ),
      ),
    );
