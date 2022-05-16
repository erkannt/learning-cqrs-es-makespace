import { faker } from '@faker-js/faker';
import {
  memberSignedUpForPractical,
  practicalScheduled,
} from '../../src/events';
import { joinPractical } from '../../src/practical/join-practical';
import { practical } from '../../src/practical/practical';
import { schedulePractical } from '../../src/practical/schedule-practical';
import { arbitraryMemberNumber, arbitraryPracticalId } from '../../src/types';
import { arbitraryDuration } from '../../src/types/duration';
import { arbitraryQuizId } from '../../src/types/quiz-id';

describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    const practicalId = arbitraryPracticalId();
    const memberNumber = arbitraryMemberNumber();
    const command = joinPractical(memberNumber, practicalId);

    describe('and the practical is in the future and has slots available', () => {
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
      const result = practical(history)(command);

      it('returns a MemberSignedUpForPractical event', () => {
        expect(result).toStrictEqual([
          memberSignedUpForPractical(memberNumber, practicalId),
        ]);
      });
    });

    describe('and the practical is in the past', () => {
      const history = [
        practicalScheduled(
          practicalId,
          faker.lorem.words(),
          [],
          2,
          faker.date.past(),
          arbitraryDuration(),
        ),
      ];
      const result = practical(history)(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('and the practical has no free spaces left', () => {
      const history = [
        practicalScheduled(
          practicalId,
          faker.lorem.words(),
          [],
          2,
          faker.date.future(),
          arbitraryDuration(),
        ),
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
    const capacity = faker.datatype.number({ min: 1, max: 10 });
    const requiredQuizzes = [arbitraryQuizId()];

    describe('and the date is in the future', () => {
      const command = schedulePractical(
        faker.lorem.words(),
        requiredQuizzes,
        capacity,
        faker.date.future(),
        arbitraryDuration(),
      );
      const result = practical([])(command);

      it('returns a PracticalScheduled event', () => {
        expect(result).toStrictEqual([
          expect.objectContaining({
            requiredQuizzes: command.requiredQuizzes,
            capacity: command.capacity,
            date: command.date,
          }),
        ]);
      });
    });

    describe('and the date is in the past', () => {
      const command = schedulePractical(
        faker.lorem.words(),
        requiredQuizzes,
        capacity,
        faker.date.past(),
        arbitraryDuration(),
      );
      const result = practical([])(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
