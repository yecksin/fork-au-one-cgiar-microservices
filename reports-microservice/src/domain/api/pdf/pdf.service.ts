import { HttpStatus, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import { create as createPDF } from 'pdf-creator-node';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { SubscribeApplicationDto } from './dto/subscribe-application.dto';
import { ClarisaService } from '../../tools/clarisa/clarisa.service';
import { ResponseUtils } from '../../utils/response.utils';

@Injectable()
export class PdfService {
  constructor(private readonly _clarisaService: ClarisaService) {}

  async generatePdf(createPdfDto: CreatePdfDto): Promise<Buffer> {
    const { data, templateData, options } = createPdfDto;
    const document = {
      html: templateData,
      data: data,
      type: 'stream',
    };

    const pdfStream: ReadStream = await createPDF(document, options);

    if (!pdfStream) throw new Error('Error generating pdf');

    const pdfBuffer: Buffer = await this.streamToBuffer(pdfStream);
    console.info('PDF generated successfully');
    return pdfBuffer;
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

      ResponseUtils.format({
        description: 'Application subscribed successfully',
        data: newApp,
        status: HttpStatus.CREATED,
      });
    } catch (error) {
      return ResponseUtils.format({
        description: `Error subscribing application: ${error}`,
        data: null,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
