import { Body, Controller, Post, Res } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { CreatePdfDto } from './dto/create-pdf.dto';

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate_pdf')
  async generatePdfHttp(
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

  @MessagePattern({ cmd: 'generate_pdf' })
  async generatePdf(@Payload() createPdfDto: CreatePdfDto): Promise<Buffer> {
    const pdf = await this.pdfService.generatePdf(createPdfDto);
    return pdf;
  }

  @Post('generate_pdf_node')
  async generatePdfHttpNode(
    @Body() createPdfDto: CreatePdfDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.pdfService.generatePdfNode(createPdfDto);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @MessagePattern({ cmd: 'generate_pdf_node' })
  async generatePdfNode(
    @Payload() createPdfDto: CreatePdfDto,
  ): Promise<Buffer> {
    const pdf = await this.pdfService.generatePdfNode(createPdfDto);
    return pdf;
  }
}
