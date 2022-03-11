import faker from '@faker-js/faker';
import * as E from 'fp-ts/Either';
import {joinPractical} from '../../src/commands';
import {practicalScheduled} from '../../src/events';
import {hasPassedRequiredQuizzes} from '../../src/practical/has-passed-required-quizzes';
import {arbitraryMemberNumber, arbitraryPracticalId} from '../../src/types';

describe('has-passed-required-quizzes', () => {
  describe('when member has passed all quizzes required to attend practical', () => {
    it.todo('returns on right');
  });

  describe('when member has NOT passed all quizzes required to attend practical', () => {
    it.todo('returns on left');
  });

  describe.skip('when practical requires no quizzes to attend', () => {
    const practicalId = arbitraryPracticalId();
    const command = joinPractical(arbitraryMemberNumber(), practicalId);
    const history = [
      practicalScheduled(arbitraryPracticalId(), 2, faker.date.future()),
    ];
    const result = hasPassedRequiredQuizzes(history)(command);

    it('returns on right', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });
});
