import { faker } from '@faker-js/faker';
import * as E from 'fp-ts/Either';
import { practicalScheduled, quizPassed } from '../../src/events';
import { hasPassedRequiredQuizzes } from '../../src/practical/has-passed-required-quizzes';
import { joinPractical } from '../../src/practical/join-practical';
import { arbitraryMemberNumber, arbitraryPracticalId } from '../../src/types';
import { arbitraryDuration } from '../../src/types/duration';
import { arbitraryQuizId } from '../../src/types/quiz-id';

describe('has-passed-required-quizzes', () => {
  const practicalId = arbitraryPracticalId();
  const memberNumber = arbitraryMemberNumber();
  const command = joinPractical(memberNumber, practicalId);

  describe('when member has passed all quizzes required to attend practical', () => {
    const quizIdA = arbitraryQuizId();
    const quizIdB = arbitraryQuizId();
    const history = [
      practicalScheduled(
        practicalId,
        faker.lorem.words(),
        [quizIdA, quizIdB],
        2,
        faker.date.future(),
        arbitraryDuration(),
      ),
      quizPassed(quizIdA, memberNumber),
      quizPassed(quizIdB, memberNumber),
    ];
    const result = hasPassedRequiredQuizzes(history)(command);

    it('returns on right', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });

  describe('when member has NOT passed all quizzes required to attend practical', () => {
    const quizIdA = arbitraryQuizId();
    const history = [
      practicalScheduled(
        practicalId,
        faker.lorem.words(),
        [quizIdA, arbitraryQuizId()],
        2,
        faker.date.future(),
        arbitraryDuration(),
      ),
      quizPassed(quizIdA, memberNumber),
    ];
    const result = hasPassedRequiredQuizzes(history)(command);

    it('returns on left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when practical requires no quizzes to attend', () => {
    const history = [
      practicalScheduled(
        practicalId,
        faker.lorem.words(),
        [],
        2,
        faker.date.future(),
        arbitraryDuration(),
      ),
    ];
    const result = hasPassedRequiredQuizzes(history)(command);

    it('returns on right', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });

  describe('when requested practical does not exist', () => {
    const result = hasPassedRequiredQuizzes([])(command);

    it('returns on left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
