import {MemberSignedUpForPractical} from './member-signed-up-for-practical';
import {PracticalScheduled} from './practical-scheduled';

export {
  PracticalScheduled,
  practicalScheduled,
  PracticalScheduledCodec,
} from './practical-scheduled';
export {
  MemberSignedUpForPractical,
  MemberSignedUpForPracticalCodec,
  memberSignedUpForPractical,
} from './member-signed-up-for-practical';

export type Event = MemberSignedUpForPractical | PracticalScheduled;
