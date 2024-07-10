import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { RabbitMQService } from '../../tools/rabbitmq/rabbitmq.service';
import { ClarisaModule } from '../../tools/clarisa/clarisa.module';

@Module({
  controllers: [MailerController],
  providers: [MailerService, RabbitMQService],
  exports: [MailerService],
  imports: [ClarisaModule],
})
export class MailerModule {}
