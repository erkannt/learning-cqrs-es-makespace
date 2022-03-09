import faker from '@faker-js/faker';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

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

type PracticalIdBrand = {
  readonly PracticalId: symbol; // TODO: Why does tsc complain when this is a unique symbol?
};

export const PracticalIdCodec = t.brand(
  tt.UUID,
  (input): input is t.Branded<tt.UUID, PracticalIdBrand> => true,
  'PracticalId'
);

export type PracticalId = t.TypeOf<typeof PracticalIdCodec>;

export const arbitraryPracticalId = (): PracticalId =>
  faker.datatype.uuid() as PracticalId;
