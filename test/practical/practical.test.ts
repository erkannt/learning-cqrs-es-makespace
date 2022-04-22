import {arbitraryMemberNumber, arbitraryPracticalId} from '../../src/types';
import {practical} from '../../src/practical/practical';
import {faker} from '@faker-js/faker';
import {joinPractical} from '../../src/practical/join-practical';
import {memberSignedUpForPractical, practicalScheduled} from '../../src/events';
import {arbitraryQuizId} from '../../src/types/quiz-id';
import {schedulePractical} from '../../src/practical/schedule-practical';

describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    const practicalId = arbitraryPracticalId();
    const memberNumber = arbitraryMemberNumber();
    const command = joinPractical(memberNumber, practicalId);

    describe('and the practical is in the future and has slots available', () => {
      const history = [
        practicalScheduled(practicalId, [], 2, faker.date.future()),
      ];
      const result = practical(history)(command);

      it('returns a MemberSignedUpForPractical event', () => {
        expect(result).toStrictEqual([
          memberSignedUpForPractical(memberNumber, practicalId),
        ]);
      });
    });

    describe('and the practical is in the past', () => {
      const history = [
        practicalScheduled(practicalId, [], 2, faker.date.past()),
      ];
      const result = practical(history)(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('and the practical has no free spaces left', () => {
      const history = [
        practicalScheduled(practicalId, [], 2, faker.date.future()),
        memberSignedUpForPractical(arbitraryMemberNumber(), practicalId),
        memberSignedUpForPractical(arbitraryMemberNumber(), practicalId),
      ];

      const result = practical(history)(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('and the practical does not exist', () => {
      const result = practical([])(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });

  describe('when given a SchedulePractical command', () => {
    describe('and the date is in the future', () => {
      it.todo('returns a PracticalScheduled event');
    });

    describe('and the date is in the past', () => {
      const requiredQuizzes = [arbitraryQuizId()];
      const spaces = faker.datatype.number({min: 1, max: 10});
      const command = schedulePractical(
        requiredQuizzes,
        spaces,
        faker.date.past()
      );
      const result = practical([])(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
