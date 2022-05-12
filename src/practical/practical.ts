import {pipe} from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import {
  Event,
  memberSignedUpForPractical,
  MemberSignedUpForPractical,
  PracticalScheduled,
  practicalScheduled,
} from '../events';
import {JoinPractical} from './join-practical';
import {SchedulePractical} from './schedule-practical';
import {arbitraryPracticalId} from '../types';
import {
  constructStateOfPractical,
  PracticalState,
} from './construct-state-of-practical';

type PracticalCommand = SchedulePractical | JoinPractical;

type PracticalEvent = PracticalScheduled | MemberSignedUpForPractical;

export type Practical = (
  history: ReadonlyArray<Event>
) => (command: PracticalCommand) => ReadonlyArray<PracticalEvent>;

export const practical: Practical = history => command => {
  switch (command._type) {
    case 'SchedulePractical': {
      const inTheFuture = (date: Date) => new Date() < date;

      return inTheFuture(command.date)
        ? [
            practicalScheduled(
              arbitraryPracticalId(),
              command.requiredQuizzes,
              command.capacity,
              command.date,
              command.duration
            ),
          ]
        : [];
    }

    case 'JoinPractical': {
      const practicalHasFreeSpacesLeft = (practicalState: PracticalState) =>
        practicalState.capacity > practicalState.attendingMembers.length;

      const practicalIsInTheFuture = (practicalState: PracticalState) =>
        new Date() < practicalState.date;

      return pipe(
        command.practicalId,
        constructStateOfPractical(history),
        O.filter(practicalHasFreeSpacesLeft),
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
