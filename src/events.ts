import {
  MemberNumber,
  MemberNumberCodec,
  PracticalId,
  PracticalIdCodec,
} from './types';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const PracticalScheduledCodec = t.type({
  _type: t.literal('PracticalScheduled'),
  capacity: t.number,
  date: tt.DateFromISOString,
  id: PracticalIdCodec,
});

export type PracticalScheduled = t.TypeOf<typeof PracticalScheduledCodec>;

export const practicalScheduled = (
  practicalId: PracticalId,
  capacity: number,
  date: Date
): PracticalScheduled => ({
  _type: 'PracticalScheduled' as const,
  id: practicalId,
  capacity,
  date,
});

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
  practicalId: PracticalId
): MemberSignedUpForPractical => ({
  _type: 'MemberSignedUpForPractical' as const,
  memberNumber,
  practicalId,
});

export type Event = PracticalScheduled | MemberSignedUpForPractical;
