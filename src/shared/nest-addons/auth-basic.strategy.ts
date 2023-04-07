import * as Nest from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Nest.Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (
    _: unknown,
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (
      this.configService.get<string>('HTTP_BASIC_USER') === username &&
      this.configService.get<string>('HTTP_BASIC_PASS') === password
    ) {
      return true;
    }
    throw new Nest.UnauthorizedException();
  };
}
