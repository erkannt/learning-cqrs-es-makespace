type PracticalScheduled = {
  _type: 'PracticalScheduled';
  capacity: number;
  date: Date;
};

type MemberSignedUpForPractical = {
  _type: 'MemberSignedUpForPractical';
  memberNumber: number;
  practicalId: string;
};

export type Event = PracticalScheduled | MemberSignedUpForPractical;
