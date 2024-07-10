import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Next, Req, Res } from '@nestjs/common';
import { AuthorizationDto } from '../global-dto/auth.dto';
import { ClarisaService } from '../../tools/clarisa/clarisa.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly clarisaService: ClarisaService) {}

  use(
    @Req() req: RequestWithCustomAttrs,
    @Res() _res: Response,
    @Next() next: NextFunction,
  ) {
    let authHeader: AuthorizationDto;
    if (typeof req.headers['auth'] === 'string') {
      try {
        authHeader = JSON.parse(req.headers['auth']);
      } catch (error) {
        throw new Error('Invalid auth header format.');
      }
    } else {
      throw new Error('Auth header is missing or not in the correct format.');
    }

    //TODO: Implement the logic to validate the token
    const TEMPdata: AuthorizationDto = {
      username: 'e2357967c4160c833916950484576bb0',
      password:
        '781b7a0d2780c6b74ef086a55c698110ff1b2d391e6d54147368f898404a14c9',
    };
    if (
      authHeader.password !== TEMPdata.password ||
      authHeader.username !== TEMPdata.username
    ) {
      throw new Error('Invalid credentials.');
    }
    req.applicationEnv = 'development';
    //-----------------------------------------
    next();
  }

  private async validateCredentials(credentials: AuthorizationDto) {
    this.clarisaService
      .authorization(credentials.username, credentials.password)
      .then((res) => {
        return res?.receiver_mis?.environment;
      });
  }
}

interface RequestWithCustomAttrs extends Request {
  [key: string]: any;
}
