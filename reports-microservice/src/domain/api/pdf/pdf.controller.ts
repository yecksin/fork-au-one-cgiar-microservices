import { Body, Controller, Post, Res } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { SubscribeApplicationDto } from './dto/subscribe-application.dto';
import { ResponseUtils } from '../../utils/response.utils';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Generate PDF')
@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdfHttpNode(
    @Body() createPdfDto: CreatePdfDto,
    @Res() res: Response,
  ) {
    return await this.pdfService.generatePdf(createPdfDto);
  }

  @MessagePattern({ cmd: 'generate' })
  async generatePdfNode(@Payload() createPdfDto: CreatePdfDto) {
    return await this.pdfService.generatePdf(createPdfDto);
  }

  @Post('subscribe-application')
  async subscribeApplication(@Body() newApplication: SubscribeApplicationDto) {
    return await this.pdfService.subscribeApplication(newApplication);
  }
}
