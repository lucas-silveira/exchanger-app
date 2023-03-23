import { Log } from './log';

export class ErrorLog extends Log {
  public readonly error: Error | Record<string, any> | string;
  public readonly gatewayResponse?: Error | Record<string, any> | string;

  constructor(
    error: Error | Record<string, any> | string,
    message: string,
    data: Record<string, unknown> = {},
    gatewayResponse: Record<string, unknown> = {},
  ) {
    super(message, data);
    this.error = error;
    this.gatewayResponse = gatewayResponse;
  }
}
