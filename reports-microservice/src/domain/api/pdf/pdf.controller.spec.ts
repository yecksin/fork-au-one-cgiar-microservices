import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { RabbitMQService } from '../../tools/rabbitmq/rabbitmq.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { Response } from 'express';

jest.mock('./pdf.service');
jest.mock('../../tools/rabbitmq/rabbitmq.service');

describe('PdfController', () => {
  let pdfController: PdfController;
  let pdfService: PdfService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [PdfService, RabbitMQService],
    }).compile();

    pdfController = module.get<PdfController>(PdfController);
    pdfService = module.get<PdfService>(PdfService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(pdfController).toBeDefined();
  });

  describe('generatePdfHttpNode', () => {
    it('should generate a PDF and send it in the response', async () => {
      const createPdfDto: CreatePdfDto = {
        data: { name: 'Test' },
        templateData: '<h1>{{name}}</h1>',
        options: {},
      };

      const mockBuffer = Buffer.from('test buffer');
      jest.spyOn(pdfService, 'generatePdf').mockResolvedValue(mockBuffer);

      const mockRes = {
        set: jest.fn(),
        end: jest.fn(),
      } as any as Response;

      await pdfController.generatePdfHttpNode(createPdfDto, mockRes);

      expect(pdfService.generatePdf).toHaveBeenCalledWith(createPdfDto);
      expect(mockRes.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=report.pdf',
        'Content-Length': mockBuffer.length,
      });
      expect(mockRes.end).toHaveBeenCalledWith(mockBuffer);
    });
  });

  describe('generatePdfNode', () => {
    it('should generate a PDF and return the buffer', async () => {
      const createPdfDto: CreatePdfDto = {
        data: { name: 'Test' },
        templateData: '<h1>{{name}}</h1>',
        options: {},
      };

      const mockBuffer = Buffer.from('test buffer');
      jest.spyOn(pdfService, 'generatePdf').mockResolvedValue(mockBuffer);

      const result = await pdfController.generatePdfNode(createPdfDto);

      expect(pdfService.generatePdf).toHaveBeenCalledWith(createPdfDto);
      expect(result).toBe(mockBuffer);
    });
  });
});
