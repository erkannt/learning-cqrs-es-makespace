import { faker } from '@faker-js/faker'
import * as t from 'io-ts'

type QuizIdBrand = {
  readonly QuizId: symbol // TODO: Why does tsc complain when this is a unique symbol?
}

export const QuizIdCodec = t.brand(
  t.string,
  // regex from https://developers.google.com/docs/api/how-tos/overview#document_id
  (input): input is t.Branded<string, QuizIdBrand> => /[a-zA-Z0-9-_]+/.test(input),
  'QuizId',
)

export type QuizId = t.TypeOf<typeof QuizIdCodec>

export const arbitraryQuizId = (): QuizId => faker.random.alphaNumeric() as QuizId
