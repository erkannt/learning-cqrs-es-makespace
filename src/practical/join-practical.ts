import * as t from 'io-ts';
import {
  MemberNumber,
  MemberNumberCodec,
  PracticalId,
  PracticalIdCodec,
} from '../types';

const JoinPractical = t.type({
  _type: t.literal('JoinPractical'),
  memberNumber: MemberNumberCodec,
  practicalId: PracticalIdCodec,
});

export type JoinPractical = t.TypeOf<typeof JoinPractical>;

export const joinPractical = (
  memberNumber: MemberNumber,
  practicalId: PracticalId,
): JoinPractical => ({
  _type: 'JoinPractical' as const,
  memberNumber,
  practicalId,
});
