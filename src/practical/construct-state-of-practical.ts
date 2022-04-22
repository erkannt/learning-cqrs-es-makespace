import {pipe} from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import {
  Event,
  PracticalScheduledCodec,
  MemberSignedUpForPracticalCodec,
} from '../events';
import {MemberNumber, PracticalId} from '../types';
import {QuizId} from '../types/quiz-id';

export type PracticalState = {
  id: PracticalId;
  requiredQuizzes: ReadonlyArray<QuizId>;
  capacity: Number;
  date: Date;
  attendingMembers: ReadonlyArray<MemberNumber>;
};

export const constructStateOfPractical =
  (history: ReadonlyArray<Event>) =>
  (practicalId: PracticalId): O.Option<PracticalState> => {
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
