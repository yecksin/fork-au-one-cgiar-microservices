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
import { ENV } from '../../shared/utils/env.utils';
import { emailStatus } from '../../shared/utils/logger.utils';

@Injectable()
export class MailerService {
  private readonly juice = require('juice');
  private readonly _logger = new Logger(MailerService.name);
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(private readonly _clarisaService: ClarisaService) {
    let options: SMTPTransport.Options = {
      host: env.SERVER_SMTP,
      port: parseInt(env.SERVER_SMTP_PORT),
      logger: !ENV.IS_PRODUCTION,
      debug: !ENV.IS_PRODUCTION,
      secure: false,
      ignoreTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
    };

    if (ENV.IS_PRODUCTION) {
      options = {
        ...options,
        auth: {
          user: env.SERVER_SMTP_USERNAME,
          pass: env.SERVER_SMTP_PASSWORD,
        },
      };
    }
    this.transporter = createTransport(options);
  }

  private _getEnv(environment: string): string {
    if (environment !== 'PROD' && environment !== undefined)
      return `${environment} - `;
    return '';
  }

  async sendMail(
    configMessage: ConfigMessageDto,
  ): Promise<ServiceResponseDto<SMTPTransport.SentMessageInfo>> {
    const subject = configMessage?.emailBody.subject || '<No subject>';
    const emailsTo: string = configMessage?.emailBody?.to;
    const emailsCc: string = configMessage?.emailBody?.cc;
    const emailsBcc: string = configMessage?.emailBody?.bcc;
    const emailFrom: string = configMessage?.from?.email || `${env.EMAIL_ROOT}`;
    const nameFrom: string = `${configMessage?.from?.name || 'One CGIAR Notification'} No reply`;
    const fromBofy: Mail.Address = {
      name: nameFrom,
      address: emailFrom,
    };
    const text: string = configMessage?.emailBody?.message?.text || '';

    if (!emailsTo.length) throw new BadRequestException('Email is required');

    let htmlBody = '';
    if (configMessage?.emailBody?.message?.file) {
      htmlBody = this.juice(
        configMessage.emailBody.message.file.toString('utf8'),
        {
          inlinePseudoElements: false,
          preserveFontFaces: true,
          preserveImportant: true,
          applyAttributesTableElements: true,
        },
      );
    }

    return this.transporter
      .sendMail({
        to: emailsTo,
        cc: emailsCc,
        bcc: emailsBcc,
        from: fromBofy,
        subject: `${this._getEnv(configMessage.environment)}${subject}`,
        text: text,
        html: htmlBody,
      })
      .then((res) => {
        emailStatus(this._logger, configMessage.sender, configMessage);
        return ResponseUtils.format({
          description: 'Email sent successfully',
          data: res,
          status: HttpStatus.CREATED,
        });
      })
      .catch((error) => {
        emailStatus(this._logger, configMessage.sender, configMessage, error);
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
