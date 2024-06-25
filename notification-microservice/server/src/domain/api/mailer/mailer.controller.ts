import { Controller, Post, Body, Param } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigMessageDto } from '../../shared/global-dto/mailer.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { MailerTypeEnum } from '../../shared/enum/mailer-type.enum';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  //TODO: Implement the sendMail method
  @Post('send/:type')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        message: { type: 'string' },
        to: { type: 'string' },
      },
    },
  })
  @ApiParam({
    name: 'type',
    required: true,
    enum: MailerTypeEnum,
  })
  sendMail(
    @Body() configMessageDto: ConfigMessageDto,
    @Param('type') type: string,
  ) {
    return this.mailerService.sendMail({
      body: {
        title: 'Correo de pruebas',
        message: 'Este es un correo de pruebas',
      },
      subject: 'Correo de pruebas',
      to: ['', ''],
    });
  }
}
