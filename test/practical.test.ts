describe('practical', () => {
  describe('when given a JoinPractical command', () => {
    describe('and the practical is in the future and has slots available', () => {
      describe('and the member has completed the online training', () => {
        it.todo('returns a MembersSignedUpForPractical event');
      });

      describe('and the member has NOT completed the online training', () => {
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
      it.todo('returns no events');
    });
  });
});
