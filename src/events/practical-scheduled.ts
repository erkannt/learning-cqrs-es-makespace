import {PracticalId, PracticalIdCodec} from '../types';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import {QuizId, QuizIdCodec} from '../types/quiz-id';
import {Duration, DurationCodec} from '../types/duration';

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
  duration: Duration
): PracticalScheduled => ({
  _type: 'PracticalScheduled' as const,
  id: practicalId,
  title,
  requiredQuizzes,
  capacity,
  date,
  duration,
});
