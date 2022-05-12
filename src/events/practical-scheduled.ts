import {PracticalId, PracticalIdCodec} from '../types';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import {QuizId, QuizIdCodec} from '../types/quiz-id';
import {Duration, DurationCodec} from '../types/duration';

export const PracticalScheduledCodec = t.type({
  _type: t.literal('PracticalScheduled'),
  id: PracticalIdCodec,
  requiredQuizzes: t.readonlyArray(QuizIdCodec),
  capacity: t.number,
  date: tt.DateFromISOString,
  duration: DurationCodec,
});

export type PracticalScheduled = t.TypeOf<typeof PracticalScheduledCodec>;

export const practicalScheduled = (
  practicalId: PracticalId,
  requiredQuizzes: ReadonlyArray<QuizId>,
  capacity: number,
  date: Date,
  duration: Duration
): PracticalScheduled => ({
  _type: 'PracticalScheduled' as const,
  id: practicalId,
  requiredQuizzes,
  capacity,
  date,
  duration,
});
