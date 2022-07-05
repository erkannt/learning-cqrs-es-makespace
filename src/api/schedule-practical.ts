import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { QuizIdCodec } from '../types/quiz-id';

const paramsCodec = t.type({
  requiredQuizzes: t.readonlyArray(QuizIdCodec),
  title: t.string,
  capacity: tt.NumberFromString,
  date: tt.DateFromISOString,
});

export const schedulePractical =
  () =>
  (params: unknown): TE.TaskEither<unknown, unknown> =>
    pipe(
      params,
      paramsCodec.decode,
      E.bimap(formatValidationErrors, identity),
      TE.fromEither,
    );
