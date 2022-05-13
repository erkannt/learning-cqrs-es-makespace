import * as t from 'io-ts'
import { MemberNumber, MemberNumberCodec } from '../types'
import { QuizId, QuizIdCodec } from '../types/quiz-id'

export const QuizPassedCodec = t.type({
  _type: t.literal('QuizPassed'),
  quizId: QuizIdCodec,
  memberNumber: MemberNumberCodec,
})

export type QuizPassed = t.TypeOf<typeof QuizPassedCodec>

export const quizPassed = (quizId: QuizId, memberNumber: MemberNumber): QuizPassed => ({
  _type: 'QuizPassed' as const,
  quizId,
  memberNumber,
})
