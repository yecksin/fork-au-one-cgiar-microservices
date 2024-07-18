import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ServiceResponseDto } from './domain/shared/global-dto/service-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ServiceResponseDto<string> {
    return this.appService.getHello();
  }
}
