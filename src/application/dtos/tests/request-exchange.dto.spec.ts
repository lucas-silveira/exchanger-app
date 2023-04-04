import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Utils } from '@shared';
import * as Tests from '@shared/testing';
import { RequestExchangeDto } from '../request-exchange.dto';

Tests.unitScope('ExchangeDto', () => {
  it('Should be able to validate dto without error', async () => {
    const dto = plainToInstance(RequestExchangeDto, {
      amount: 120.1,
      source: 'BRL',
    });

    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('amount property', () => {
    it('Should be able to throw error if it is empty', async () => {
      const dto = plainToInstance(RequestExchangeDto, {
        amount: undefined,
        source: 'BRL',
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
        amount: '123',
        source: 'BRL',
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(errors?.at(0)?.constraints, 'isNumber'),
      ).toBe(true);
    });

    it('Should be able to throw error if it is not positive', async () => {
      const dto = plainToInstance(RequestExchangeDto, {
        amount: -1,
        source: 'BRL',
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

  describe('source property', () => {
    it('Should be able to throw error if it is empty', async () => {
      const dto = plainToInstance(RequestExchangeDto, {
        amount: 120.1,
        source: undefined,
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
        amount: 120.1,
        source: 'x',
      });

      const errors: ValidationError[] = await validate(dto);
      expect(errors.length).toBe(1);
      expect(
        Utils.ObjectChecker.fieldExists(errors?.at(0)?.constraints, 'isEnum'),
      ).toBe(true);
    });
  });
});
