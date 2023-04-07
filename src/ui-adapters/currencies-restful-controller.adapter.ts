import * as Nest from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as Swagger from '@nestjs/swagger';
import * as NestAddons from '@shared/nest-addons';
import { Log } from '@shared/telemetry';
import * as App from '@application';

@Swagger.ApiBasicAuth()
@Nest.UseGuards(AuthGuard('basic'))
@Nest.Controller('currencies')
export class CurrenciesRESTfulController {
  private readonly logger = new NestAddons.AppLogger(
    CurrenciesRESTfulController.name,
  );

  constructor(
    public readonly appCurrencyService: App.Services.AppCurrencyService,
  ) {}

  @Swagger.ApiOperation({ description: 'Create a new currency' })
  @Nest.Post()
  public async createCurrency(
    @Nest.Body() dto: App.DTOs.RequestCreateCurrencyDto,
  ): Promise<App.DTOs.ResponseCurrencyDto> {
    this.logger.log(
      new Log(`API request received to create a new currency`, { dto }),
    );
    return await this.appCurrencyService.createCurrency(dto);
  }

  @Swagger.ApiOperation({
    description: 'Exchange a currency for every available currency',
  })
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
