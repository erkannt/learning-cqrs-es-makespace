import * as TE from 'fp-ts/TaskEither';

export const schedulePractical = (): TE.TaskEither<unknown, unknown> =>
  TE.right('received schedule-practical POST');
