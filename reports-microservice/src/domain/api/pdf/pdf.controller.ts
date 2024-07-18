import { Body, Controller, Post, Res } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { RabbitMQService } from '../../tools/rabbitmq/rabbitmq.service';
import { SubscribeApplicationDto } from './dto/subscribe-application.dto';

@Controller()
export class PdfController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly pdfService: PdfService,
  ) {}

  // @Post('generate-puppeteer')
  // async generatePdfHttpNodePuppeteer(
  //   @Body() createPdfDto: CreatePdfDto,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const pdf = await this.pdfService.generatePdfPuppeteer(createPdfDto);
  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'attachment; filename=report.pdf',
  //     'Content-Length': pdf.length,
  //   });
  //   res.end(pdf);
  // }

  // @MessagePattern('generate-puppeteer')
  // async generatePdfNodePuppeteer(
  //   @Payload() createPdfDto: CreatePdfDto,
  // ): Promise<Buffer> {
  //   const pdf = await this.pdfService.generatePdfPuppeteer(createPdfDto);
  //   return pdf;
  // }

  @Post('generate')
  async generatePdfHttpNode(
    @Body() createPdfDto: CreatePdfDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.pdfService.generatePdf(createPdfDto);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @MessagePattern('generate')
  async generatePdfNode(
    @Payload() createPdfDto: CreatePdfDto,
  ): Promise<Buffer> {
    const pdf = await this.pdfService.generatePdf(createPdfDto);
    return pdf;
  }

  @Post('subscribe-application')
  async subscribeApplication(@Body() newApplication: SubscribeApplicationDto) {
    return await this.pdfService.subscribeApplication(newApplication);
  }
}
