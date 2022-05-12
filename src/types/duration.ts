import faker from '@faker-js/faker';
import * as t from 'io-ts';

type HoursBrand = {
  readonly Hours: symbol;
};

const HoursCodec = t.brand(
  t.Int,
  (input): input is t.Branded<t.Int, HoursBrand> => input > 0,
  'Hours'
);

type Hours = t.TypeOf<typeof HoursCodec>;

type MinutesBrand = {
  readonly Minutes: symbol;
};

const MinutesCodec = t.brand(
  t.Int,
  (input): input is t.Branded<t.Int, MinutesBrand> => input > 0,
  'Minutes'
);

type Minutes = t.TypeOf<typeof MinutesCodec>;

export const DurationCodec = t.type({
  hours: HoursCodec,
  minutes: MinutesCodec,
});

export type Duration = t.TypeOf<typeof DurationCodec>;

export const arbitraryDuration = () => ({
  hours: faker.datatype.number(24) as Hours,
  minutes: faker.datatype.number(60) as Minutes,
});
