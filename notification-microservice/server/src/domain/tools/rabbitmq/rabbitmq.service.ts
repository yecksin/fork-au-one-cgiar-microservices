import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { env } from 'process';

@Injectable()
export class RabbitMQService {
  private client: ClientProxy;

  constructor() {
    const queueHost: string = `amqps://${env.MQ_USER}:${env.MQ_PASSWORD}@${env.MQ_HOST}`;
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [queueHost],
        queue: env.QUEUE_PATH,
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async emitToPattern<T>(pattern: string, message: T) {
    return this.client.emit(pattern, message);
  }
}
