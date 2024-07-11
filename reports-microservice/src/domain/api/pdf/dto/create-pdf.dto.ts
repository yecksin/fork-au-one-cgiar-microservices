export class CreatePdfDto {
  data: any;
  templateData: string;
  options: any;
}

interface DataPdf {
  title: string;
  message: string;
  image: string;
}
