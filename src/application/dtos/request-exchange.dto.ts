import * as Validator from 'class-validator';
import { CurrencyId } from '@domain';

export class RequestExchangeDto {
  @Validator.IsNotEmpty()
  @Validator.IsNumber()
  @Validator.IsPositive()
  amount: number;

  @Validator.IsNotEmpty()
  @Validator.IsEnum(CurrencyId)
  source: CurrencyId;
}
