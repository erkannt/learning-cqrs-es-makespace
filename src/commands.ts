import {MemberNumberCodec} from './types';
import * as t from 'io-ts';

const JoinPractical = t.type({
  _type: t.literal('JoinPractical'),
  memberNumber: MemberNumberCodec,
  practicalId: t.string,
});

type JoinPractical = t.TypeOf<typeof JoinPractical>;

export type Command = JoinPractical;
