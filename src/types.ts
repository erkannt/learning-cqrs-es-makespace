import faker from '@faker-js/faker';
import * as t from 'io-ts';

type MemberNumberBrand = {
  readonly MemberNumber: symbol; // TODO: Why does tsc complain when this is a unique symbol?
};

export const MemberNumberCodec = t.brand(
  t.Int,
  (input): input is t.Branded<t.Int, MemberNumberBrand> => input > 0,
  'MemberNumber'
);

export type MemberNumber = t.TypeOf<typeof MemberNumberCodec>;

export const arbitraryMemberNumber = (): MemberNumber =>
  faker.datatype.number() as MemberNumber;
