import {
  MemberNumber,
  MemberNumberCodec,
  PracticalId,
  PracticalIdCodec,
} from '../types';
import * as t from 'io-ts';
import {QuizId, QuizIdCodec} from '../types/quiz-id';
import * as tt from 'io-ts-types';

const JoinPractical = t.type({
  _type: t.literal('JoinPractical'),
  memberNumber: MemberNumberCodec,
  practicalId: PracticalIdCodec,
});

export type JoinPractical = t.TypeOf<typeof JoinPractical>;

export const joinPractical = (
  memberNumber: MemberNumber,
  practicalId: PracticalId
): JoinPractical => ({
  _type: 'JoinPractical' as const,
  memberNumber,
  practicalId,
});

const SchedulePractical = t.type({
  _type: t.literal('SchedulePractical'),
  requiredQuizzes: t.readonlyArray(QuizIdCodec),
  spaces: t.number,
  date: tt.date,
});

export type SchedulePractical = t.TypeOf<typeof SchedulePractical>;

export const schedulePractical = (
  requiredQuizzes: ReadonlyArray<QuizId>,
  spaces: number,
  date: Date
): SchedulePractical => ({
  _type: 'SchedulePractical' as const,
  requiredQuizzes,
  spaces,
  date,
});

export type Command = JoinPractical | SchedulePractical;
