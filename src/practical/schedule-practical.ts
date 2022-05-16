import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Duration, DurationCodec } from '../types/duration';
import { QuizId, QuizIdCodec } from '../types/quiz-id';

const SchedulePractical = t.type({
  _type: t.literal('SchedulePractical'),
  requiredQuizzes: t.readonlyArray(QuizIdCodec),
  title: t.string,
  capacity: t.number,
  date: tt.date,
  duration: DurationCodec,
});

export type SchedulePractical = t.TypeOf<typeof SchedulePractical>;

export const schedulePractical = (
  title: string,
  requiredQuizzes: ReadonlyArray<QuizId>,
  capacity: number,
  date: Date,
  duration: Duration,
): SchedulePractical => ({
  _type: 'SchedulePractical' as const,
  title,
  requiredQuizzes,
  capacity,
  date,
  duration,
});
