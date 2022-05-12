import * as t from 'io-ts';

type HoursBrand = {
  readonly Hours: symbol;
};

const HoursCodec = t.brand(
  t.Int,
  (input): input is t.Branded<t.Int, HoursBrand> => input > 0,
  'Hours'
);

type MinutesBrand = {
  readonly Minutes: symbol;
};

const MinutesCodec = t.brand(
  t.Int,
  (input): input is t.Branded<t.Int, MinutesBrand> => input > 0,
  'Minutes'
);

export const DurationCodec = t.type({
  hours: HoursCodec,
  minutes: MinutesCodec,
});

export type Duration = t.TypeOf<typeof DurationCodec>;
