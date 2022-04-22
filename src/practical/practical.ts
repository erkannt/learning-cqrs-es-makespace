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
  practicalScheduled,
} from '../events';
import {JoinPractical} from './join-practical';
import {SchedulePractical} from './schedule-practical';
import {arbitraryPracticalId, MemberNumber, PracticalId} from '../types';
import {QuizId} from '../types/quiz-id';

type PracticalCommand = SchedulePractical | JoinPractical;

type PracticalEvent = PracticalScheduled | MemberSignedUpForPractical;

type PracticalState = {
  id: PracticalId;
  requiredQuizzes: ReadonlyArray<QuizId>;
  capacity: Number;
  date: Date;
  attendingMembers: ReadonlyArray<MemberNumber>;
};

const constructStateOfPractical =
  (history: ReadonlyArray<Event>) => (practicalId: PracticalId) => {
    const getAttending = pipe(
      history,
      RA.filter(MemberSignedUpForPracticalCodec.is),
      RA.filter(event => event.practicalId === practicalId),
      RA.map(event => event.memberNumber)
    );

    const state = pipe(
      history,
      RA.filter(PracticalScheduledCodec.is),
      RA.findFirst(event => event.id === practicalId),
      O.map(partial => ({...partial, attendingMembers: getAttending}))
    );

    return state;
  };

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
              command.date
            ),
          ]
        : [];
    }

    case 'JoinPractical': {
      const practicalHasFreeSpacesLeft = (practicalState: PracticalState) =>
        practicalState.capacity > practicalState.attendingMembers.length;

      const practicalIsInTheFuture = (event: PracticalScheduled) =>
        new Date() < event.date;

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
