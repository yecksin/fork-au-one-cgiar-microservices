import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthorizationDto } from '../global-dto/auth.dto';
import { ClarisaService } from '../../tools/clarisa/clarisa.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly clarisaService: ClarisaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToRpc().getData();
    const { auth }: { auth: AuthorizationDto } = data;
    const env = this.validateCredentials(auth);
    if (typeof env === 'undefined') {
      throw new UnauthorizedException('Invalid credentials');
    }

    return next.handle().pipe(tap(() => console.log('Request processed')));
  }

  private async validateCredentials(credentials: AuthorizationDto) {
    this.clarisaService
      .authorization(credentials.username, credentials.password)
      .then((res) => {
        return res?.receiver_mis?.environment;
      });
  }
}
