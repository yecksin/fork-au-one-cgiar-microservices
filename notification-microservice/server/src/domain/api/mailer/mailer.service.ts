import { BadRequestException, Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from 'process';
import { ConfigMessageDto } from '../../shared/global-dto/mailer.dto';

@Injectable()
export class MailerService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    this.transporter = createTransport(
      {
        service: 'gmail',
        auth: { user: env.EMAIL_ROOT, pass: env.EMAIL_PASSWORD },
      },
      { from: { name: 'No-reply', address: env.EMAIL_ROOT } },
    );
  }

  _formatEmailList(email: string[] | string) {
    return Array.isArray(email) ? email.join(',') : email;
  }

  async sendMail(configMessage: ConfigMessageDto) {
    const subject = configMessage?.subject || '<No subject>';
    const emailsTo: string = this._formatEmailList(configMessage?.to);
    if (!emailsTo.length) throw new BadRequestException('Email is required');

    return this.transporter.sendMail({
      to: emailsTo,
      subject: subject,
      html: configMessage.body.message,
    });
  }
}
