import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigMessageDto } from '../../shared/global-dto/mailer.dto';
import { RabbitMQService } from '../../tools/rabbitmq/rabbitmq.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger';
import { MailerService } from './mailer.service';
import { SearchRequest } from '../../shared/decorators/search-request.decorator';
import { ResponseUtils } from '../../shared/utils/response.utils';

@Controller()
export class MailerController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly _mailerService: MailerService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        from: { type: 'string' },
        emailBody: {
          type: 'object',
          properties: {
            subject: { type: 'string' },
            to: {
              type: 'array',
              items: { type: 'string' },
            },
            cc: {
              type: 'array',
              items: { type: 'string' },
              nullable: true,
            },
            bcc: {
              type: 'array',
              items: { type: 'string' },
              nullable: true,
            },
            message: {
              type: 'object',
              properties: {
                text: { type: 'string', nullable: true },
                file: { type: 'string', nullable: true },
              },
            },
          },
        },
      },
    },
  })
  @ApiHeader({
    name: 'auth',
    description:
      'Custom header containing the encoded AuthorizationDto (username and password)',
    required: true,
    schema: {
      type: 'string',
      example: '{"username": "user", "password": "pass"}',
    },
  })
  @Post('send')
  @UseInterceptors(FileInterceptor('file'))
  sendMail(
    @UploadedFile() file: Express.Multer.File,
    @Body() configMessageDto: ConfigMessageDto,
    @SearchRequest('applicationEnv') appEnv: string,
  ) {
    const temp = configMessageDto;
    temp.emailBody = JSON.parse(String(configMessageDto.emailBody));
    temp.environment = appEnv;

    if (file && file?.mimetype === 'text/html') {
      temp.emailBody.message.file = file.buffer.toString('utf8');
    } else {
      temp.emailBody.message.file = null;
    }
    this.rabbitMQService.sendToQueue('messages_queue', temp);
    return ResponseUtils.format({
      description: 'Message sent successfully',
      status: 200,
    });
  }

  @Post('subscribe-application')
  subscribeApplication() {
    return this._mailerService.subscribeApplication({
      clientName: 'PRMS-test',
      domain: 'https://prms-test.com',
      environmentName: 'development',
    });
  }
}
