import * as Validator from 'class-validator';
import { CurrencyId } from '@domain';

export class RequestCreateCurrencyDto {
  @Validator.IsNotEmpty()
  @Validator.IsEnum(CurrencyId)
  isoCode: CurrencyId;

  @Validator.IsNotEmpty()
  @Validator.IsString()
  public name: string;

  @Validator.IsNotEmpty()
  @Validator.IsNumber()
  @Validator.IsPositive()
  usdRate: number;
}
