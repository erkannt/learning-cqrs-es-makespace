import faker from '@faker-js/faker';
import * as E from 'fp-ts/Either';
import {joinPractical} from '../../src/commands';
import {practicalScheduled} from '../../src/events';
import {hasPassedRequiredQuizzes} from '../../src/practical/has-passed-required-quizzes';
import {arbitraryMemberNumber, arbitraryPracticalId} from '../../src/types';

describe('has-passed-required-quizzes', () => {
  const practicalId = arbitraryPracticalId();
  const command = joinPractical(arbitraryMemberNumber(), practicalId);

  describe('when member has passed ALL quizzes required to attend practical', () => {
    it.todo('returns on right');
  });

  describe('when member has passed SOME quizzes required to attend practical', () => {
    it.todo('returns on left');
  });

  describe('when member has passed NO quizzes required to attend practical', () => {
    it.todo('returns on left');
  });

  describe('when practical requires no quizzes to attend', () => {
    const history = [
      practicalScheduled(practicalId, [], 2, faker.date.future()),
    ];
    const result = hasPassedRequiredQuizzes(history)(command);

    it('returns on right', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });

  describe('when requested practical does not exist', () => {
    it.todo('returns on left');
  });
});
