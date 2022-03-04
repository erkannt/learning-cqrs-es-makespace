type PracticalScheduled = {
  _type: 'PracticalScheduled';
  capacity: number;
};

type MemberSignedUpForPractical = {
  _type: 'MemberSignedUpForPractical';
  memberNumber: number;
  practicalId: string;
};

export type Event = PracticalScheduled | MemberSignedUpForPractical;
