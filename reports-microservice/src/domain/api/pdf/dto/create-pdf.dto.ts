import { ApiProperty } from '@nestjs/swagger';

export class CreatePdfDto {
  @ApiProperty()
  public data: any;
  @ApiProperty()
  public templateData: string;
  @ApiProperty()
  public options: any;
  @ApiProperty()
  public bucketName: string;
  @ApiProperty()
  public fileName: string;
  @ApiProperty()
  public user: any;
}
