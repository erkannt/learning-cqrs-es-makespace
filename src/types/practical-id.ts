import faker from '@faker-js/faker';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

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
