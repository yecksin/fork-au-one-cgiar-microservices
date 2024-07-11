import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from 'process';
import { ConfigMessageDto } from '../../shared/global-dto/mailer.dto';
import { SubscribeApplicationDto } from './dto/ubscribe-application.dto';
import { ResponseUtils } from '../../shared/utils/response.utils';
import Mail from 'nodemailer/lib/mailer';
import { ClarisaService } from '../../tools/clarisa/clarisa.service';
import { ServiceResponseDto } from '../../shared/global-dto/service-response.dto';

@Injectable()
export class MailerService {
  private readonly _logger = new Logger(MailerService.name);
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(private readonly _clarisaService: ClarisaService) {
    this.transporter = createTransport({
      host: env.SERVER_SMTP,
      port: parseInt(env.SERVER_SMTP_PORT),
      logger: true,
      debug: true,
      secure: false,
      ignoreTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private _getEnv(environment: string): string {
    if (environment !== 'PROD') return `${environment} - `;
    return '';
  }

  async sendMail(
    configMessage: ConfigMessageDto,
  ): Promise<ServiceResponseDto<SMTPTransport.SentMessageInfo>> {
    const subject = configMessage?.emailBody.subject || '<No subject>';
    const emailsTo: string = configMessage?.emailBody?.to;
    const emailsCc: string = configMessage?.emailBody?.cc;
    const emailsBcc: string = configMessage?.emailBody?.bcc;
    const emailFrom: string = configMessage?.from.email || `${env.EMAIL_ROOT}`;
    const nameFrom: string = `${configMessage?.from?.name || 'One CGIAR Notification'} No reply`;
    const fromBofy: Mail.Address = {
      name: nameFrom,
      address: emailFrom,
    };

    if (!emailsTo.length) throw new BadRequestException('Email is required');

    return this.transporter
      .sendMail({
        to: emailsTo,
        cc: emailsCc,
        bcc: emailsBcc,
        from: fromBofy,
        subject: `${this._getEnv(configMessage.environment)}${subject}`,
        html:
          configMessage?.emailBody?.message?.file ||
          configMessage?.emailBody?.message?.text,
      })
      .then((res) =>
        ResponseUtils.format({
          description: 'Email sent successfully',
          data: res,
          status: HttpStatus.CREATED,
        }),
      )
      .catch((error) => {
        this._logger.error(error);
        return ResponseUtils.format({
          description: 'Error sending email',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: error,
        });
      });
  }

  async subscribeApplication(newApplication: SubscribeApplicationDto) {
    return this._clarisaService
      .createConnection({
        acronym: newApplication.acronym,
        environment: newApplication.environment,
      })
      .then((res) =>
        ResponseUtils.format({
          description: 'Application subscribed successfully',
          data: res,
          status: HttpStatus.CREATED,
        }),
      );
  }
}
