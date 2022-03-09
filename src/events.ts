import {MemberNumber} from './types';

type PracticalScheduled = {
  _type: 'PracticalScheduled';
  capacity: number;
  date: Date;
  id: string;
};

export const practicalScheduled = (
  practicalId: string,
  capacity: number,
  date: Date
): PracticalScheduled => ({
  _type: 'PracticalScheduled' as const,
  id: practicalId,
  capacity,
  date,
});

type MemberSignedUpForPractical = {
  _type: 'MemberSignedUpForPractical';
  memberNumber: MemberNumber;
  practicalId: string;
};

export const memberSignedUpForPractical = (
  memberNumber: MemberNumber,
  practicalId: string
): MemberSignedUpForPractical => ({
  _type: 'MemberSignedUpForPractical' as const,
  memberNumber,
  practicalId,
});

export type Event = PracticalScheduled | MemberSignedUpForPractical;
