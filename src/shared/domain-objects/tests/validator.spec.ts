import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import {
  checkIfIsNotEmpty,
  checkIfIsValidEnum,
  checkIfLengthIsNotGreaterThan,
  checkIfIsNotGreaterThan,
  checkIfIsNotLessThan,
  checkIfIsNumber,
  checkIfIsInteger,
} from '../validator';

Tests.unitScope('Validator', () => {
  describe('checkIfIsNotEmpty', () => {
    it('Should be able to not throw a DomainException if the value is not empty', () => {
      expect(() => checkIfIsNotEmpty(1, 'message')).not.toThrow();
      expect(() => checkIfIsNotEmpty(0, 'message')).not.toThrow();
      expect(() => checkIfIsNotEmpty(false, 'message')).not.toThrow();
      expect(() => checkIfIsNotEmpty({ x: 1 }, 'message')).not.toThrow();
      expect(() => checkIfIsNotEmpty([1], 'message')).not.toThrow();
    });

    it('Should be able to throw a DomainException if the value is empty', () => {
      expect(() => checkIfIsNotEmpty(undefined, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNotEmpty(null, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNotEmpty({}, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNotEmpty([], 'message')).toThrowError(
        DomainException,
      );
    });
  });

  describe('checkIfIsValidEnum', () => {
    enum TestEnum {
      One = 'one',
      Two = 'two',
    }

    it('Should be able to not throw a DomainException if the value is a valid enum', () => {
      expect(() =>
        checkIfIsValidEnum(TestEnum, TestEnum.One, 'message'),
      ).not.toThrow();
      expect(() =>
        checkIfIsValidEnum(TestEnum, 'two', 'message'),
      ).not.toThrow();
      expect(() =>
        checkIfIsValidEnum(TestEnum, [TestEnum.One], 'message'),
      ).not.toThrow();
      expect(() =>
        checkIfIsValidEnum(TestEnum, ['two'], 'message'),
      ).not.toThrow();
    });

    it('Should be able to throw a DomainException if the value is not a valid enum', () => {
      expect(() =>
        checkIfIsValidEnum(TestEnum, undefined, 'message'),
      ).toThrowError(DomainException);
      expect(() => checkIfIsValidEnum(TestEnum, 1, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsValidEnum(TestEnum, [1], 'message')).toThrowError(
        DomainException,
      );
    });
  });

  describe('checkIfLengthIsNotGreaterThan', () => {
    it('Should be able to not throw a DomainException if the value is lower or equal to maximum', () => {
      expect(() =>
        checkIfLengthIsNotGreaterThan('1', 10, 'message'),
      ).not.toThrow();
      expect(() =>
        checkIfLengthIsNotGreaterThan('1', 1, 'message'),
      ).not.toThrow();
      expect(() =>
        checkIfLengthIsNotGreaterThan('x', 1, 'message'),
      ).not.toThrow();
    });

    it('Should be able to throw a DomainException if the value is greater than maximum', () => {
      expect(() =>
        checkIfLengthIsNotGreaterThan('10', 1, 'message'),
      ).toThrowError(DomainException);
      expect(() =>
        checkIfLengthIsNotGreaterThan(10, 1, 'message'),
      ).toThrowError(DomainException);
      expect(() =>
        checkIfLengthIsNotGreaterThan('xx', 1, 'message'),
      ).toThrowError(DomainException);
    });
  });

  describe('checkIfIsNotGreaterThan', () => {
    it('Should be able to not throw a DomainException if the value is lower or equal to maximum', () => {
      expect(() => checkIfIsNotGreaterThan(1, 10, 'message')).not.toThrow();
      expect(() => checkIfIsNotGreaterThan(1, 1, 'message')).not.toThrow();
    });

    it('Should be able to throw a DomainException if the value is greater than maximum', () => {
      expect(() => checkIfIsNotGreaterThan(10, 1, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNotGreaterThan('1', 1, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNotGreaterThan('x', 1, 'message')).toThrowError(
        DomainException,
      );
    });
  });

  describe('checkIfIsNotLessThan', () => {
    it('Should be able to not throw a DomainException if the value is lower or equal to minimum', () => {
      expect(() => checkIfIsNotLessThan(10, 1, 'message')).not.toThrow();
      expect(() => checkIfIsNotLessThan(1, 1, 'message')).not.toThrow();
    });

    it('Should be able to throw a DomainException if the value is lower than minimum', () => {
      expect(() => checkIfIsNotLessThan(1, 10, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNotLessThan('1', 1, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNotLessThan('x', 1, 'message')).toThrowError(
        DomainException,
      );
    });
  });

  describe('checkIfIsNumber', () => {
    it('Should be able to not throw a DomainException if the value is a number', () => {
      expect(() => checkIfIsNumber(0, 'message')).not.toThrow();
      expect(() => checkIfIsNumber(1, 'message')).not.toThrow();
      expect(() => checkIfIsNumber(1.2, 'message')).not.toThrow();
      expect(() => checkIfIsNumber(1_000_000, 'message')).not.toThrow();
      expect(() => checkIfIsNumber(-1, 'message')).not.toThrow();
    });

    it('Should be able to throw a DomainException if the value is not a number', () => {
      expect(() => checkIfIsNumber('1', 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNumber('x', 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNumber(false, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNumber(true, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNumber([], 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsNumber(undefined, 'message')).toThrowError(
        DomainException,
      );
    });
  });

  describe('checkIfIsInteger', () => {
    it('Should be able to not throw a DomainException if the value is a integer', () => {
      expect(() => checkIfIsInteger(0, 'message')).not.toThrow();
      expect(() => checkIfIsInteger(1, 'message')).not.toThrow();
      expect(() => checkIfIsInteger(10, 'message')).not.toThrow();
      expect(() => checkIfIsInteger(-1, 'message')).not.toThrow();
    });

    it('Should be able to throw a DomainException if the value is not a integer', () => {
      expect(() => checkIfIsInteger(1.2, 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsInteger('1', 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsInteger('1.2', 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsInteger('x', 'message')).toThrowError(
        DomainException,
      );
      expect(() => checkIfIsInteger(undefined, 'message')).toThrowError(
        DomainException,
      );
    });
  });
});
