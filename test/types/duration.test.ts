import {pipe} from 'fp-ts/lib/function';
import {DurationCodec} from '../../src/types/duration';
import * as E from 'fp-ts/Either';
import faker from '@faker-js/faker';

describe('duration', () => {
  describe('given a valid ISO-8601 duration', () => {
    const input = 'P1DT12H';
    const result = pipe(
      input,
      DurationCodec.decode,
      E.getOrElseW(() => {
        throw new Error('should not happen');
      }),
      DurationCodec.encode
    );

    it('decodes and encodes back to same string', () => {
      expect(result).toBe(input);
    });
  });

  describe('given an invalid duration string', () => {
    const input = faker.datatype.string();
    const result = pipe(input, DurationCodec.decode);

    it('returns on left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
