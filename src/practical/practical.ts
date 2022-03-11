import {pipe} from 'fp-ts/lib/function';
import {JoinPractical} from '../commands';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import {
  Event,
  PracticalScheduledCodec,
  MemberSignedUpForPracticalCodec,
  memberSignedUpForPractical,
} from '../events';

export type Practical = (
  history: ReadonlyArray<Event>
) => (command: JoinPractical) => ReadonlyArray<Event>;

export const practical: Practical = history => command => {
  const practical = pipe(
    history,
    RA.filter(PracticalScheduledCodec.is),
    RA.findFirst(event => event.id === command.practicalId)
  );

  const attendingMembers = pipe(
    history,
    RA.filter(MemberSignedUpForPracticalCodec.is),
    RA.filter(event => event.practicalId === command.practicalId),
    RA.map(event => event.memberNumber)
  );

  return pipe(
    practical,
    O.match(
      () => [],
      ({capacity, date}) => {
        if (capacity <= attendingMembers.length) {
          return [];
        }
        if (new Date() > date) {
          return [];
        }
        return [
          memberSignedUpForPractical(command.memberNumber, command.practicalId),
        ];
      }
    )
  );
};
