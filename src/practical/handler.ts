import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { Event } from '../events'
import { hasPassedRequiredQuizzes } from './has-passed-required-quizzes'
import { JoinPractical } from './join-practical'
import { practical } from './practical'

export const commandHandler = (history: ReadonlyArray<Event>) => (command: JoinPractical) =>
  pipe(command, E.right, E.chainFirst(hasPassedRequiredQuizzes(history)), E.map(practical(history)))
