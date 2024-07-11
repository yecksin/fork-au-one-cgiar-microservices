import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClarisaService } from '../../tools/clarisa/clarisa.service';
import { ConfigMessageSocketDto } from '../global-dto/mailer.dto';
import { ResClarisaValidateConectioDto } from '../../tools/clarisa/dtos/clarisa-create-conection.dto';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly clarisaService: ClarisaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const data = JSON.parse(context.switchToRpc().getData() || '{}');
    const payload: ConfigMessageSocketDto = data;
    const authData = await this.clarisaService.authorization(
      payload?.auth?.username,
      payload?.auth?.password,
    );
    if (!authData.valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    payload.data.environment = (
      authData.data as ResClarisaValidateConectioDto
    ).receiver_mis.environment;

    return next
      .handle()
      .pipe(map((_data) => ({ ...payload, application: authData.data })));
  }
}
