import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { create as createPDF } from 'pdf-creator-node';
import { CreatePdfDto } from './dto/create-pdf.dto';

@Injectable()
export class PdfService {
  async generatePdf(createPdfDto: CreatePdfDto): Promise<Buffer> {
    console.log('🚀 ~ PdfService ~ generatePdf ~ createPdfDto:', createPdfDto);
    const { data, templateData, options } = createPdfDto;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const template = handlebars.compile(templateData);
    const html = template(data);

    await page.setContent(html);
    const pdf = await page.pdf(options);
    console.log('🚀 ~ PdfService ~ generatePdf ~ pdf:', pdf);

    await browser.close();
    if (!pdf) throw new Error('Error generating pdf');

    console.info('Pdf generated successfully');
    return pdf;
  }

  async generatePdfNode(createPdfDto: CreatePdfDto): Promise<Buffer> {
    console.log('🚀 ~ PdfService ~ generatePdf ~ createPdfDto:', createPdfDto);
    const { data, templateData, options } = createPdfDto;
    const document = {
      html: templateData,
      data: data,
      type: 'stream',
    };

    const pdfStream: ReadStream = await createPDF(document, options);
    console.log('🚀 ~ PdfService ~ generatePdfNode ~ pdfStream:', pdfStream);

    if (!pdfStream) throw new Error('Error generating pdf');

    // Convert the ReadStream to a Buffer
    const pdfBuffer: Buffer = await this.streamToBuffer(pdfStream);
    console.info('Pdf generated successfully');
    return pdfBuffer;
  }

  private streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }
}
