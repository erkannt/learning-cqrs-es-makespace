import {practical} from '../src/practical';
import {faker} from '@faker-js/faker';

describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    describe('and the practical is in the future and has slots available', () => {
      it.todo('returns a MembersSignedUpForPractical event');
    });

    describe('and the practical is in the past', () => {
      const practicalId = 'foo';
      const command = {
        _type: 'JoinPractical' as const,
        memberNumber: 123,
        practicalId,
      };
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
      const practicalId = 'foo';
      const command = {
        _type: 'JoinPractical' as const,
        memberNumber: 123,
        practicalId,
      };
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
      const command = {
        _type: 'JoinPractical' as const,
        memberNumber: 123,
        practicalId: 'foo',
      };

      const result = practical([])(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
