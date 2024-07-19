import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { SubscribeApplicationDto } from './dto/subscribe-application.dto';
import { ClarisaService } from '../../tools/clarisa/clarisa.service';
import { ResponseUtils } from '../../utils/response.utils';
import { create as createPDF } from 'pdf-creator-node';
import { ReadStream } from 'fs';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class PdfService {
  private readonly _logger = new Logger(PdfService.name);
  constructor(
    private readonly _clarisaService: ClarisaService,
    private readonly _notificationsService: NotificationsService,
  ) {}

  async generatePdf(createPdfDto: CreatePdfDto): Promise<Buffer> {
    try {
      const { data, templateData, options } = createPdfDto;
      const document = {
        html: templateData,
        data: data,
        type: 'stream',
      };

      const pdfStream: ReadStream = await createPDF(document, options);

      if (!pdfStream) throw new Error('Error converting pdf to stream');

      const pdfBuffer: Buffer = await this.streamToBuffer(pdfStream);
      console.info('PDF generated successfully');
      return pdfBuffer;
    } catch (error) {
      this._logger.error(`Error generating pdf: ${error}`);
      this._notificationsService.sendSlackNotification(
        ':report:',
        'Reports Microservice - PDF',
        '#FF0000',
        'Error notification details',
        `Error generating pdf: ${error}`,
        'High',
      );
      throw new Error(`Error generating pdf ${error}`);
    }
  }

  public streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

  async subscribeApplication(newApplication: SubscribeApplicationDto) {
    try {
      const newApp = await this._clarisaService.createConnection({
        acronym: newApplication.acronym,
        environment: newApplication.environment,
      });

      return ResponseUtils.format({
        description: 'Application subscribed successfully',
        data: newApp,
        status: HttpStatus.CREATED,
      });
    } catch (error) {
      this._logger.error(`Error subscribing application: ${error}`);
      this._notificationsService.sendSlackNotification(
        ':report:',
        'Reports Microservice - PDF',
        '#FF0000',
        'Error notification details',
        `Error subscribing application: ${error}`,
        'High',
      );
      return ResponseUtils.format({
        description: `Error subscribing application: ${error}`,
        data: null,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
