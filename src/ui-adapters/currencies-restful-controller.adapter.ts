import * as Nest from '@nestjs/common';
import * as NestAddons from '@shared/nest-addons';
import { Log } from '@shared/telemetry';
import * as App from '@application';

@Nest.Controller('currencies')
export class CurrenciesRESTfulController {
  private readonly logger = new NestAddons.AppLogger(
    CurrenciesRESTfulController.name,
  );

  constructor(
    public readonly appCurrencyService: App.Services.AppCurrencyService,
  ) {}

  @Nest.Post()
  public async createCurrency(
    @Nest.Body() dto: App.DTOs.RequestCreateCurrencyDto,
  ): Promise<App.DTOs.ResponseCurrencyDto> {
    this.logger.log(
      new Log(`API request received to create a new currency`, { dto }),
    );
    return await this.appCurrencyService.createCurrency(dto);
  }

  @Nest.Post('exchange')
  public async exchange(
    @Nest.Body() dto: App.DTOs.RequestExchangeDto,
  ): Promise<App.DTOs.ResponseMoneyDto[]> {
    this.logger.log(
      new Log(`API request received to exchange currencies`, { dto }),
    );
    return await this.appCurrencyService.exchange(dto);
  }
}
