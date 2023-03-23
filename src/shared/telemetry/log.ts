export class Log {
  public readonly data?: Record<string, any>;
  public readonly message: string;

  constructor(message: string, data: Record<string, any> = {}) {
    this.message = message;
    this.data = data;
  }
}
