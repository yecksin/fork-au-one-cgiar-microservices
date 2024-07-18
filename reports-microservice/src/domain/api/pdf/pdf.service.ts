import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { SubscribeApplicationDto } from './dto/subscribe-application.dto';
import { ClarisaService } from '../../tools/clarisa/clarisa.service';
import { ResponseUtils } from '../../utils/response.utils';
import { create as createPDF } from 'pdf-creator-node';
// import * as handlebars from 'handlebars';
// import * as puppeteer from 'puppeteer';
import { ReadStream } from 'fs';

@Injectable()
export class PdfService {
  private readonly _logger = new Logger(PdfService.name);
  constructor(private readonly _clarisaService: ClarisaService) {}

  // async generatePdfPuppeteer(createPdfDto: CreatePdfDto): Promise<Buffer> {
  //   console.log('🚀 ~ PdfService ~ generatePdf ~ createPdfDto:', createPdfDto);
  //   const { data, templateData, options } = createPdfDto;
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();

  //   const template = handlebars.compile(templateData);
  //   const html = template(data);

  //   await page.setContent(html);
  //   const pdf = await page.pdf(options);
  //   console.log('🚀 ~ PdfService ~ generatePdf ~ pdf:', pdf);

  //   await browser.close();
  //   if (!pdf) throw new Error('Error generating pdf');

  //   console.info('Pdf generated successfully');
  //   return pdf;
  // }

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

      ResponseUtils.format({
        description: 'Application subscribed successfully',
        data: newApp,
        status: HttpStatus.CREATED,
      });
    } catch (error) {
      this._logger.error(`Error subscribing application: ${error}`);
      return ResponseUtils.format({
        description: `Error subscribing application: ${error}`,
        data: null,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
