import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { CreatePdfDto } from './dto/create-pdf.dto';

describe('PdfController', () => {
  let controller: PdfController;
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [
        {
          provide: PdfService,
          useValue: {
            generatePdf: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PdfController>(PdfController);
    service = module.get<PdfService>(PdfService);
  });

  it('should generate a PDF and send it in the response', async () => {
    const createPdfDto: CreatePdfDto = {
      data: { title: 'Test', message: 'Hello', image: 'test.jpg' },
      templateData: '<div>{{title}}</div>',
    };
    const pdfBuffer = Buffer.from('mock-pdf');
    jest.spyOn(service, 'generatePdf').mockResolvedValue(pdfBuffer);

    const res = {
      set: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;

    await controller.generatePdfHttp(createPdfDto, res);

    expect(service.generatePdf).toHaveBeenCalledWith(createPdfDto);
    expect(res.set).toHaveBeenCalledWith({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': pdfBuffer.length,
    });
    expect(res.end).toHaveBeenCalledWith(pdfBuffer);
  });

  it('should generate a PDF from a message', async () => {
    const createPdfDto: CreatePdfDto = {
      data: { title: 'Test', message: 'Hello', image: 'test.jpg' },
      templateData: '<div>{{title}}</div>',
    };
    const pdfBuffer = Buffer.from('mock-pdf');
    jest.spyOn(service, 'generatePdf').mockResolvedValue(pdfBuffer);

    const result = await controller.generatePdf(createPdfDto);

    expect(service.generatePdf).toHaveBeenCalledWith(createPdfDto);
    expect(result).toBe(pdfBuffer);
  });
});
