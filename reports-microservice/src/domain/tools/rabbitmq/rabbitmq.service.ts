import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { PdfService } from '../../api/pdf/pdf.service';
import { env } from 'process';

@Injectable()
export class RabbitMQService {
  private client: ClientProxy;

  constructor(private readonly _pdfService: PdfService) {
    const queueName: string = `${env.QUEUE_NAME}reports_pdf_queue`;
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [env.RABBITMQ_URL],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async sendToQueue<T>(queue: string, message: T) {
    const parsedMessage: string = JSON.stringify(message);
    return this.client.emit(queue, parsedMessage);
  }
}
