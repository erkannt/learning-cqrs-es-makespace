import {practical} from '../src/practical';

describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    describe('and the practical is in the future and has slots available', () => {
      describe('and the member has completed the online training', () => {
        it.todo('returns a MembersSignedUpForPractical event');
      });

      describe('and the member has NOT completed the online training', () => {
        it.todo('returns no events');
      });

      describe('and the member has completed only a different online training', () => {
        it.todo('returns no events');
      });
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
      const history = [
        {
          _type: 'CompletedOnlineTraining' as const,
          memberNumber: 123,
          trainingId: 'ultimaker',
        },
      ];

      const result = practical(history)(command);

      it('returns no events', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
