import * as Tests from '@shared/testing';
import { validate } from '../config-validator';

Tests.unitScope('ConfigValidator', () => {
  beforeAll(() => {
    // changing node env in order to test functions
    process.env.NODE_ENV = 'development';
  });

  describe('validate', () => {
    it('Should be able to validate a config data', () => {
      const configData = {
        field1: true,
        field2: {
          field2_1: true,
        },
      };
      expect(() => validate(configData)).not.toThrow();
    });

    it('Should be able to throw Error if a empty field exists', () => {
      const configData = { field1: true, field2: undefined };
      const configData2 = {
        field1: true,
        field2: {
          field2_1: true,
          field2_2: undefined,
        },
      };
      expect(() => validate(configData)).toThrowError(Error);
      expect(() => validate(configData2)).toThrowError(Error);
    });
  });
});
