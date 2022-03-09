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
  memberNumber: number;
  practicalId: string;
};

export type Event = PracticalScheduled | MemberSignedUpForPractical;
