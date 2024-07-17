import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { Readable } from 'stream';
import * as pdfCreator from 'pdf-creator-node';

jest.mock('pdf-creator-node', () => ({
  create: jest.fn(),
}));

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePdf', () => {
    it('should generate a PDF and return a Buffer', async () => {
      const createPdfDto: CreatePdfDto = {
        data: { name: 'Test' },
        templateData: '<h1>{{name}}</h1>',
        options: {},
      };

      const mockReadStream = new Readable();
      mockReadStream.push('test buffer');
      mockReadStream.push(null);

      (pdfCreator.create as jest.Mock).mockResolvedValue(mockReadStream);

      const mockBuffer = Buffer.from('test buffer');
      jest.spyOn(service, 'streamToBuffer').mockResolvedValue(mockBuffer);

      const result = await service.generatePdf(createPdfDto);

      expect(result).toBe(mockBuffer);
      expect(pdfCreator.create).toHaveBeenCalledWith(
        {
          html: createPdfDto.templateData,
          data: createPdfDto.data,
          type: 'stream',
        },
        createPdfDto.options,
      );
      expect(service.streamToBuffer).toHaveBeenCalledWith(mockReadStream);
    });

    it('should throw an error if pdf creation fails', async () => {
      const createPdfDto: CreatePdfDto = {
        data: { name: 'Test' },
        templateData: '<h1>{{name}}</h1>',
        options: {},
      };

      (pdfCreator.create as jest.Mock).mockResolvedValue(null);

      await expect(service.generatePdf(createPdfDto)).rejects.toThrow(
        'Error generating pdf',
      );
    });
  });
});
