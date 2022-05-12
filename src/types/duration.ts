import {identity, pipe} from 'fp-ts/lib/function';
import * as t from 'io-ts';
import {Duration, parse, serialize} from 'tinyduration';
import * as E from 'fp-ts/Either';

const parseDurationString = (input: string) =>
  E.tryCatch(() => parse(input), identity);

const isDurationString = (input: unknown) =>
  pipe(
    input,
    t.string.decode,
    E.chain(parseDurationString),
    E.match(
      () => false,
      () => true
    )
  );

export const DurationCodec = new t.Type<Duration, string>(
  'DurationCodec',
  (u: unknown): u is Duration => isDurationString(u),
  (input, context) =>
    pipe(
      input,
      t.string.decode,
      E.chain(parseDurationString),
      E.match(() => t.failure(input, context), t.success)
    ),
  serialize
);
