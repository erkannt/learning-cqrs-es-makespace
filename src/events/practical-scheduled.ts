import {PracticalId, PracticalIdCodec} from '../types';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const PracticalScheduledCodec = t.type({
  _type: t.literal('PracticalScheduled'),
  capacity: t.number,
  date: tt.DateFromISOString,
  id: PracticalIdCodec,
});

export type PracticalScheduled = t.TypeOf<typeof PracticalScheduledCodec>;

export const practicalScheduled = (
  practicalId: PracticalId,
  capacity: number,
  date: Date
): PracticalScheduled => ({
  _type: 'PracticalScheduled' as const,
  id: practicalId,
  capacity,
  date,
});
