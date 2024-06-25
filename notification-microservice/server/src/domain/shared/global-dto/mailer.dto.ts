import { ApiProperty } from '@nestjs/swagger';

class MailerBodyDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  message: string;
}

export class ConfigMessageDto {
  @ApiProperty()
  subject: string;
  @ApiProperty()
  body: MailerBodyDto;
  @ApiProperty()
  to: string | string[];
}
