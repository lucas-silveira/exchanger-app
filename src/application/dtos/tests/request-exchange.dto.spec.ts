import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Utils } from '@shared';
import * as Tests from '@shared/testing';
import { RequestExchangeDto } from '../request-exchange.dto';

Tests.unitScope('RequestExchangeDto', () => {
  it('Should be able to validate dto without error', async () => {
    const dto = plainToInstance(RequestExchangeDto, {
      source: 'BRL',
      amount: 120.1,
    });

    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('source property', () => {
    it('Should be able to throw error if it is empty', async () => {
      const dto = plainToInstance(RequestExchangeDto, {
        source: undefined,
        amount: 120.1,
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
      const dto = plainToInstance(RequestExchangeDto, {
        source: 'x',
        amount: 120.1,
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(errors?.at(0)?.constraints, 'isEnum'),
      ).toBe(true);
    });
  });

  describe('amount property', () => {
    it('Should be able to throw error if it is empty', async () => {
      const dto = plainToInstance(RequestExchangeDto, {
        source: 'BRL',
        amount: undefined,
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
      const dto = plainToInstance(RequestExchangeDto, {
        source: 'BRL',
        amount: '123',
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(errors?.at(0)?.constraints, 'isNumber'),
      ).toBe(true);
    });

    it('Should be able to throw error if it is not positive', async () => {
      const dto = plainToInstance(RequestExchangeDto, {
        source: 'BRL',
        amount: -1,
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
