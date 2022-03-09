import {MemberNumber, MemberNumberCodec} from './types';
import * as t from 'io-ts';

const JoinPractical = t.type({
  _type: t.literal('JoinPractical'),
  memberNumber: MemberNumberCodec,
  practicalId: t.string,
});

type JoinPractical = t.TypeOf<typeof JoinPractical>;

export type Command = JoinPractical;

export const joinPractical = (
  memberNumber: MemberNumber,
  practicalId: string
): JoinPractical => ({
  _type: 'JoinPractical' as const,
  memberNumber,
  practicalId,
});
