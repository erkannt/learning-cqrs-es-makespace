import {pipe} from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import {
  Event,
  PracticalScheduledCodec,
  MemberSignedUpForPracticalCodec,
  memberSignedUpForPractical,
  MemberSignedUpForPractical,
  PracticalScheduled,
} from '../events';
import {JoinPractical} from './join-practical';
import {SchedulePractical} from './schedule-practical';

type PracticalCommand = SchedulePractical | JoinPractical;

export type Practical = (
  history: ReadonlyArray<Event>
) => (command: PracticalCommand) => ReadonlyArray<MemberSignedUpForPractical>;

export const practical: Practical = history => command => {
  switch (command._type) {
    case 'SchedulePractical':
      return [];
    case 'JoinPractical': {
      const getPractical = pipe(
        history,
        RA.filter(PracticalScheduledCodec.is),
        RA.findFirst(event => event.id === command.practicalId)
      );

      const getAttendingCount = pipe(
        history,
        RA.filter(MemberSignedUpForPracticalCodec.is),
        RA.filter(event => event.practicalId === command.practicalId),
        RA.map(event => event.memberNumber),
        RA.size
      );

      const practicalHasFreeSpacesLeft =
        (attendingCount: number) => (event: PracticalScheduled) =>
          event.capacity > attendingCount;

      const practicalIsInTheFuture = (event: PracticalScheduled) =>
        new Date() < event.date;

      return pipe(
        getPractical,
        O.filter(practicalHasFreeSpacesLeft(getAttendingCount)),
        O.filter(practicalIsInTheFuture),
        O.match(
          () => [],
          () => {
            return [
              memberSignedUpForPractical(
                command.memberNumber,
                command.practicalId
              ),
            ];
          }
        )
      );
    }
  }
};
