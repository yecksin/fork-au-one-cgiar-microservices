import { Injectable, HttpStatus } from '@nestjs/common';
import { ServiceResponseDto } from './domain/shared/global-dto/service-response.dto';
import { ResponseUtils } from './domain/utils/response.utils';

@Injectable()
export class AppService {
  getHello(): ServiceResponseDto<string> {
    const data = 'Welcome to the Reports Microservice!';

    return ResponseUtils.format({
      data,
      description: 'The Reports Microservice is running for CGIAR applications.',
      status: HttpStatus.OK,
    });
  }
}
