import * as t from 'io-ts';
import {
  MemberNumber,
  MemberNumberCodec,
  PracticalId,
  PracticalIdCodec,
} from '../types';

export const MemberSignedUpForPracticalCodec = t.type({
  _type: t.literal('MemberSignedUpForPractical'),
  memberNumber: MemberNumberCodec,
  practicalId: PracticalIdCodec,
});

export type MemberSignedUpForPractical = t.TypeOf<
  typeof MemberSignedUpForPracticalCodec
>;

export const memberSignedUpForPractical = (
  memberNumber: MemberNumber,
  practicalId: PracticalId,
): MemberSignedUpForPractical => ({
  _type: 'MemberSignedUpForPractical' as const,
  memberNumber,
  practicalId,
});
