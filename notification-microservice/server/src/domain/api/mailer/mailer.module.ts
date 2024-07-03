import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { RabbitMQService } from '../../tools/rabbitmq/rabbitmq.service';

@Module({
  controllers: [MailerController],
  providers: [MailerService, RabbitMQService],
  exports: [MailerService],
})
export class MailerModule {}
