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
import { randomBytes } from 'crypto';
import { ResponseUtils } from '../../shared/utils/response.utils';

@Injectable()
export class MailerService {
  private readonly _logger = new Logger(MailerService.name);
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
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
      //service: 'gmail',
      //auth: { user: env.EMAIL_ROOT, pass: env.EMAIL_PASSWORD },
    });
  }

  private _getEnv(environment: string): string {
    switch (environment) {
      case 'production':
        return '';
      case 'development':
        return 'DEV - ';
      default:
        return 'TEST - ';
    }
  }

  async sendMail(configMessage: ConfigMessageDto) {
    const subject = configMessage?.emailBody.subject || '<No subject>';
    const emailsTo: string = configMessage?.emailBody?.to;
    const emailsCc: string = configMessage?.emailBody?.cc;
    const emailsBcc: string = configMessage?.emailBody?.bcc;
    const emailFrom: string = configMessage?.from || `${env.EMAIL_ROOT}`;
    if (!emailsTo.length) throw new BadRequestException('Email is required');

    this.transporter
      .sendMail({
        to: emailsTo,
        cc: emailsCc,
        bcc: emailsBcc,
        from: { name: 'No-reply', address: emailFrom },
        subject: `${this._getEnv(configMessage.environment)}${subject}`,
        html:
          configMessage?.emailBody?.message?.file ||
          configMessage?.emailBody?.message?.text,
      })
      .catch((error) => {
        this._logger.error(error);
      });
  }

  subscribeApplication(newApplication: SubscribeApplicationDto) {
    //TODO: Implement this method in CLARISA
    const clientId = randomBytes(16).toString('hex');
    const secretKey = randomBytes(32).toString('hex');
    /**
     *
     */
    const TEMPclientId = 'e2357967c4160c833916950484576bb0';
    const TEMPsecretKey =
      '781b7a0d2780c6b74ef086a55c698110ff1b2d391e6d54147368f898404a14c9';
    return ResponseUtils.format({
      description: 'Application subscribed successfully',
      data: {
        ...newApplication,
        clientId: TEMPclientId,
        secretKey: TEMPsecretKey,
        alert: 'this is a temporary key, please store it in a safe place',
      },
      status: HttpStatus.CREATED,
    });
  }
}
