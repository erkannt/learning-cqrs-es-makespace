import {practical} from '../src/practical';
import {faker} from '@faker-js/faker';

describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    const practicalId = 'foo';
    const memberNumber = 123;
    const command = {
      _type: 'JoinPractical' as const,
      memberNumber: 123,
      practicalId,
    };

    describe('and the practical is in the future and has slots available', () => {
      const history = [
        {
          _type: 'PracticalScheduled' as const,
          id: practicalId,
          capacity: 2,
          date: faker.date.future(),
        },
      ];
      const result = practical(history)(command);

      it.skip('returns a MemberSignedUpForPractical event', () => {
        expect(result).toStrictEqual({
          _type: 'MemberSignedUpForPractical',
          memberNumber,
          practicalId,
        });
      });
    });

    describe('and the practical is in the past', () => {
      const history = [
        {
          _type: 'PracticalScheduled' as const,
          id: practicalId,
          capacity: 2,
          date: faker.date.past(),
        },
      ];
      const result = practical(history)(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('and the practical has no free spaces left', () => {
      const history = [
        {
          _type: 'PracticalScheduled' as const,
          id: practicalId,
          capacity: 2,
          date: faker.date.future(),
        },
        {
          _type: 'MemberSignedUpForPractical' as const,
          memberNumber: 456,
          practicalId,
        },
        {
          _type: 'MemberSignedUpForPractical' as const,
          memberNumber: 789,
          practicalId,
        },
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
