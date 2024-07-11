import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import { CreatePdfDto } from './dto/create-pdf.dto';

jest.mock('puppeteer');

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should generate a PDF', async () => {
    const createPdfDto: CreatePdfDto = {
      data: { title: 'Test', message: 'Hello', image: 'test.jpg' },
      templateData: '<div>{{name}}</div>',
    };

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue({
        setContent: jest.fn().mockResolvedValue(undefined),
        pdf: jest.fn().mockResolvedValue(Buffer.from('mock-pdf')),
        close: jest.fn().mockResolvedValue(undefined),
      }),
      close: jest.fn().mockResolvedValue(undefined),
    };
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const pdf = await service.generatePdf(createPdfDto);

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.toString()).toBe('mock-pdf');
  });
});
