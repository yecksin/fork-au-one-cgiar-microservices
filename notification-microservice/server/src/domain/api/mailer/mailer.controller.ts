import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigMessageDto } from '../../shared/global-dto/mailer.dto';
import { RabbitMQService } from '../../tools/rabbitmq/rabbitmq.service';

@Controller()
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  //TODO: Implement the sendMail method
  @Post('send-mail')
  sendMail(@Body() configMessageDto: ConfigMessageDto) {
    this.rabbitMQService.sendToQueue('messages_queue', configMessageDto);
  }
}
