import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { PdfService } from '../../api/pdf/pdf.service';

@Injectable()
export class RabbitMQService {
  private client: ClientProxy;

  constructor(private readonly _pdfService: PdfService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'pdf_reports_queue',
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
