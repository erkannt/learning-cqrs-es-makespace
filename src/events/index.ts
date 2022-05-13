import { MemberSignedUpForPractical } from './member-signed-up-for-practical'
import { PracticalScheduled } from './practical-scheduled'
import { QuizPassed } from './quiz-passed'

export { PracticalScheduled, practicalScheduled, PracticalScheduledCodec } from './practical-scheduled'

export {
  MemberSignedUpForPractical,
  MemberSignedUpForPracticalCodec,
  memberSignedUpForPractical,
} from './member-signed-up-for-practical'
export { quizPassed, QuizPassed, QuizPassedCodec } from './quiz-passed'

export type Event = MemberSignedUpForPractical | PracticalScheduled | QuizPassed
