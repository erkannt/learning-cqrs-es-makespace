import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import {
  MemberSignedUpForPractical,
  MemberSignedUpForPracticalCodec,
} from './member-signed-up-for-practical';
import {
  PracticalScheduled,
  PracticalScheduledCodec,
} from './practical-scheduled';
import { QuizPassed, QuizPassedCodec } from './quiz-passed';

export {
  PracticalScheduled,
  practicalScheduled,
  PracticalScheduledCodec,
  arbitraryPracticalScheduled,
} from './practical-scheduled';

export {
  MemberSignedUpForPractical,
  MemberSignedUpForPracticalCodec,
  memberSignedUpForPractical,
} from './member-signed-up-for-practical';
export { quizPassed, QuizPassed, QuizPassedCodec } from './quiz-passed';

export type Event =
  | MemberSignedUpForPractical
  | PracticalScheduled
  | QuizPassed;

export const EventCodec = t.union([
  PracticalScheduledCodec,
  MemberSignedUpForPracticalCodec,
  QuizPassedCodec,
]);

export const EventFromStringCodec = tt.JsonFromString.pipe(
  EventCodec,
  'EventFromStringCodec',
);

export const EventsCodec = t.readonlyArray(EventCodec);
