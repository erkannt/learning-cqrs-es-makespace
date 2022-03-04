import {practical} from '../src/practical';

describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    describe('and the practical is in the future and has slots available', () => {
      it.todo('returns a MembersSignedUpForPractical event');
    });

    describe('and the practical is in the past', () => {
      it.todo('returns no events');
    });

    describe('and the practical has no free spaces left', () => {
      it.todo('returns no events');
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
