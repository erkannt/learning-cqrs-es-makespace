import { faker } from '@faker-js/faker';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { PracticalId, PracticalIdCodec, arbitraryPracticalId } from '../types';
import { Duration, DurationCodec, arbitraryDuration } from '../types/duration';
import { QuizId, QuizIdCodec, arbitraryQuizId } from '../types/quiz-id';

export const PracticalScheduledCodec = t.type({
  _type: t.literal('PracticalScheduled'),
  id: PracticalIdCodec,
  title: t.string,
  requiredQuizzes: t.readonlyArray(QuizIdCodec),
  capacity: t.number,
  date: tt.DateFromISOString,
  duration: DurationCodec,
});

export type PracticalScheduled = t.TypeOf<typeof PracticalScheduledCodec>;

export const practicalScheduled = (
  practicalId: PracticalId,
  title: string,
  requiredQuizzes: ReadonlyArray<QuizId>,
  capacity: number,
  date: Date,
  duration: Duration,
): PracticalScheduled => ({
  _type: 'PracticalScheduled' as const,
  id: practicalId,
  title,
  requiredQuizzes,
  capacity,
  date,
  duration,
});

export const arbitraryPracticalScheduled = () =>
  practicalScheduled(
    arbitraryPracticalId(),
    faker.lorem.words(),
    // Array.from(Array(faker.datatype.number(5)).map(() => arbitraryQuizId())), # Returns null?
    [arbitraryQuizId()],
    faker.datatype.number({ min: 2, max: 10 }),
    faker.date.future(),
    arbitraryDuration(),
  );
