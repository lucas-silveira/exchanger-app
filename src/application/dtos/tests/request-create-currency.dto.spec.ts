import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Utils } from '@shared';
import * as Tests from '@shared/testing';
import { RequestCreateCurrencyDto } from '../request-create-currency.dto';

Tests.unitScope('RequestCreateCurrencyDto', () => {
  it('Should be able to validate dto without error', async () => {
    const dto = plainToInstance(RequestCreateCurrencyDto, {
      isoCode: 'BRL',
      name: 'Real',
      usdRate: 5,
    });

    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('isoCode property', () => {
    it('Should be able to throw error if it is empty', async () => {
      const dto = plainToInstance(RequestCreateCurrencyDto, {
        isoCode: undefined,
        name: 'Real',
        usdRate: 5,
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(
          errors?.at(0)?.constraints,
          'isNotEmpty',
        ),
      ).toBe(true);
    });

    it('Should be able to throw error if it is not enum', async () => {
      const dto = plainToInstance(RequestCreateCurrencyDto, {
        isoCode: 'x',
        name: 'Real',
        usdRate: 5,
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(errors?.at(0)?.constraints, 'isEnum'),
      ).toBe(true);
    });
  });

  describe('name property', () => {
    it('Should be able to throw error if it is empty', async () => {
      const dto = plainToInstance(RequestCreateCurrencyDto, {
        isoCode: 'BRL',
        name: undefined,
        usdRate: 5,
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(
          errors?.at(0)?.constraints,
          'isNotEmpty',
        ),
      ).toBe(true);
    });

    it('Should be able to throw error if it is not string', async () => {
      const dto = plainToInstance(RequestCreateCurrencyDto, {
        isoCode: 'BRL',
        name: 1,
        usdRate: 5,
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(errors?.at(0)?.constraints, 'isString'),
      ).toBe(true);
    });
  });

  describe('usdRate property', () => {
    it('Should be able to throw error if it is empty', async () => {
      const dto = plainToInstance(RequestCreateCurrencyDto, {
        isoCode: 'BRL',
        name: 'Real',
        usdRate: undefined,
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(
          errors?.at(0)?.constraints,
          'isNotEmpty',
        ),
      ).toBe(true);
    });

    it('Should be able to throw error if it is not number', async () => {
      const dto = plainToInstance(RequestCreateCurrencyDto, {
        isoCode: 'BRL',
        name: 'Real',
        usdRate: '5',
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(errors?.at(0)?.constraints, 'isNumber'),
      ).toBe(true);
    });

    it('Should be able to throw error if it is not positive', async () => {
      const dto = plainToInstance(RequestCreateCurrencyDto, {
        isoCode: 'BRL',
        name: 'Real',
        usdRate: -1,
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(
          errors?.at(0)?.constraints,
          'isPositive',
        ),
      ).toBe(true);
    });
  });
});
