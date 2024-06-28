import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';
import { MailerService } from '../../api/mailer/mailer.service';
import { ConfigMessageDto } from '../../shared/global-dto/mailer.dto';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private channel: Channel;
  private connection: Connection;

  constructor(private readonly _mailerService: MailerService) {}

  async onModuleInit() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.initQueue('messages_queue');
    this.consumeQueue<ConfigMessageDto>('messages_queue', async (data) =>
      this._mailerService.sendMail(data),
    );
  }

  async initQueue(...queues: string[]) {
    if (!queues.length) return;
    for (const queue of queues) {
      await this.channel.assertQueue(queue, { durable: true });
    }
  }

  async sendToQueue<T>(queue: string, message: T) {
    const parsedMessage: string = JSON.stringify(message);
    return this.channel.sendToQueue(queue, Buffer.from(parsedMessage), {
      persistent: true,
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async consumeQueue<T>(chanel: string, callback: (data: T) => Promise<void>) {
    this.channel.consume(chanel, async (msg) => {
      if (msg !== null) {
        const data: T = JSON.parse(msg.content.toString());
        callback(data);
        this.channel.ack(msg);
      }
    });
  }
}
