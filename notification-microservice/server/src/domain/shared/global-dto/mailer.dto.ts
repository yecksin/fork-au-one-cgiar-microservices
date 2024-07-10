import { ApiProperty } from '@nestjs/swagger';

class EmailBodyMessage {
  @ApiProperty()
  text?: string;
  @ApiProperty({ required: false })
  file?: string;
}

class EmailBody {
  @ApiProperty()
  subject: string;
  @ApiProperty()
  to: string;
  @ApiProperty()
  cc?: string;
  @ApiProperty()
  bcc?: string;
  @ApiProperty()
  message: EmailBodyMessage;
}

class FromBody {
  @ApiProperty()
  email: string;
  @ApiProperty()
  name?: string;
}

export class ConfigMessageDto {
  @ApiProperty()
  from?: FromBody;
  @ApiProperty()
  emailBody: EmailBody;
  @ApiProperty({ required: false })
  environment?: string;
}
