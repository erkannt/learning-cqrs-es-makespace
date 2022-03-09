import {arbitraryMemberNumber, arbitraryPracticalId} from './../src/types';
import {practical} from '../src/practical';
import {faker} from '@faker-js/faker';
import {memberSignedUpForPractical, practicalScheduled} from '../src/events';
import {joinPractical} from '../src/commands';

describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    const practicalId = arbitraryPracticalId();
    const memberNumber = arbitraryMemberNumber();
    const command = joinPractical(memberNumber, practicalId);

    describe('and the practical is in the future and has slots available', () => {
      const history = [practicalScheduled(practicalId, 2, faker.date.future())];
      const result = practical(history)(command);

      it('returns a MemberSignedUpForPractical event', () => {
        expect(result).toStrictEqual([
          memberSignedUpForPractical(memberNumber, practicalId),
        ]);
      });
    });

    describe('and the practical is in the past', () => {
      const history = [practicalScheduled(practicalId, 2, faker.date.past())];
      const result = practical(history)(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('and the practical has no free spaces left', () => {
      const history = [
        practicalScheduled(practicalId, 2, faker.date.future()),
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
});
