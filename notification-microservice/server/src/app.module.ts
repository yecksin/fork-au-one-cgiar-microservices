import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from './domain/api/mailer/mailer.module';
import { RabbitMQModule } from './domain/tools/rabbitmq/rabbitmq.module';

@Module({
  imports: [MailerModule, RabbitMQModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
