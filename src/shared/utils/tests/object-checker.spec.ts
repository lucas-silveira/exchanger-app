import * as Tests from '@shared/testing';
import { fieldExists, checkIfHasEmptyFields } from '../object-checker';

Tests.unitScope('ObjectChecker', () => {
  describe('fieldExists', () => {
    it('Should be able to get true if a field exists in a object', () => {
      const obj = { field1: 123 };
      expect(fieldExists(obj, 'field1')).toBe(true);
    });

    it('Should be able to get false if a field not exists in a object', () => {
      const obj = { field1: 123 };
      expect(fieldExists(obj, 'field2')).toBe(false);
    });

    it('Should be able to get false if a field is in a nested object', () => {
      const obj = {
        field1: {
          field2: 123,
        },
      };
      expect(fieldExists(obj, 'field2')).toBe(false);
    });

    it('Should be able to get false if we pass an undefined object', () => {
      expect(fieldExists(undefined, 'field1')).toBe(false);
    });
  });

  describe('checkIfHasEmptyFields function', () => {
    let callbackMock: jest.Mock;

    beforeEach(() => {
      callbackMock = jest.fn(() => undefined);
    });

    it('Should be able to not execute callback if a not empty value is passed', () => {
      const value = 1;
      const fieldName = 'value';

      expect(() =>
        checkIfHasEmptyFields(value, fieldName, callbackMock),
      ).not.toThrow();
      expect(callbackMock).not.toBeCalled();
    });

    it('Should be able to not execute callback if a not empty object is passed', () => {
      const value = { field: 1 };
      const fieldName = 'value';

      expect(() =>
        checkIfHasEmptyFields(value, fieldName, callbackMock),
      ).not.toThrow();
      expect(callbackMock).not.toBeCalled();
    });

    it('Should be able to execute callback 1 time if an empty value is passed', () => {
      const value = undefined;
      const fieldName = 'value';

      expect(() =>
        checkIfHasEmptyFields(value, fieldName, callbackMock),
      ).not.toThrow();
      expect(callbackMock).toBeCalledTimes(1);
      expect(callbackMock).toBeCalledWith(fieldName);
    });

    it('Should be able to execute callback 1 time if an object with 1 empty field is passed', () => {
      const value = { field: undefined };
      const fieldName = 'obj';

      expect(() =>
        checkIfHasEmptyFields(value, fieldName, callbackMock),
      ).not.toThrow();
      expect(callbackMock).toBeCalledTimes(1);
      expect(callbackMock).toBeCalledWith(`${fieldName}.field`);
    });

    it('Should be able to execute callback 2 time if an object with 2 empty fields is passed', () => {
      const value = { field1: undefined, field2: undefined, field3: 1 };
      const fieldName = 'obj';

      expect(() =>
        checkIfHasEmptyFields(value, fieldName, callbackMock),
      ).not.toThrow();
      expect(callbackMock).toBeCalledTimes(2);
      expect(callbackMock).nthCalledWith(1, `${fieldName}.field1`);
      expect(callbackMock).nthCalledWith(2, `${fieldName}.field2`);
    });

    it('Should be able to execute callback 2 time if nested objects with empty fields is passed', () => {
      const value = {
        field1: { field1_1: undefined, field1_2: 1 },
        field2: undefined,
        field3: 1,
      };
      const fieldName = 'obj';

      expect(() =>
        checkIfHasEmptyFields(value, fieldName, callbackMock),
      ).not.toThrow();
      expect(callbackMock).toBeCalledTimes(2);
      expect(callbackMock).nthCalledWith(1, `${fieldName}.field1.field1_1`);
      expect(callbackMock).nthCalledWith(2, `${fieldName}.field2`);
    });
  });
});
