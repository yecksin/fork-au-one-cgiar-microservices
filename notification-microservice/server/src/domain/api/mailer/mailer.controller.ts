import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConfigMessageDto,
  ConfigMessageSocketDto,
} from '../../shared/global-dto/mailer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger';
import { MailerService } from './mailer.service';
import { SearchRequest } from '../../shared/decorators/search-request.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscribeApplicationDto } from './dto/ubscribe-application.dto';
import {
  ResClarisaValidateConectioDto,
  ResMisConfigDto,
} from '../../tools/clarisa/dtos/clarisa-create-conection.dto';
import { AuthInterceptor } from '../../shared/Interceptors/microservices.interceptor';

@Controller()
export class MailerController {
  constructor(private readonly _mailerService: MailerService) {}

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
        from: { type: 'object' },
        emailBody: {
          type: 'object',
          properties: {
            subject: { type: 'string' },
            to: {
              type: 'string',
            },
            cc: {
              type: 'string',
              nullable: true,
            },
            bcc: {
              type: 'string',
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
  async sendMail(
    @UploadedFile() file: Express.Multer.File,
    @Body() configMessageDto: ConfigMessageDto,
    @SearchRequest('application') appConect: ResClarisaValidateConectioDto,
  ) {
    const temp = configMessageDto;
    temp.emailBody = JSON.parse(String(configMessageDto.emailBody));
    temp.from = JSON.parse(String(configMessageDto.from));
    temp.environment = appConect.receiver_mis.environment;
    temp.sender = appConect;

    if (file && file?.mimetype === 'text/html') {
      temp.emailBody.message.file = file.buffer;
    } else {
      temp.emailBody.message.file = null;
    }

    return this._mailerService.sendMail(temp);
  }

  @MessagePattern('send')
  @UseInterceptors(AuthInterceptor)
  async handleIncomingMessage(@Payload() data: string) {
    const newMessage: ConfigMessageSocketDto = JSON.parse(data);
    const file = newMessage.data?.emailBody?.message?.socketFile;
    if (file && file?.mimetype === 'text/html') {
      newMessage.data.emailBody.message.file = file.buffer;
    } else {
      newMessage.data.emailBody.message.file = null;
    }
    const message = newMessage.data;
    return this._mailerService.sendMail(message);
  }

  @Post('subscribe-application')
  subscribeApplication(@Body() newApplication: SubscribeApplicationDto) {
    return this._mailerService.subscribeApplication(newApplication);
  }
}
