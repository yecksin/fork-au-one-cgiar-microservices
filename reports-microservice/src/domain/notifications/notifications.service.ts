import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { env } from 'process';

@Injectable()
export class NotificationsService {
  private slackWebhookUrl: string;

  constructor() {
    this.slackWebhookUrl = env.SLACK_WEBHOOK_URL;
  }

  async sendSlackNotification(
    emoji: string,
    text: string,
    color: string,
    title: string,
    info: string,
    priority: string,
  ) {
    try {
      const response = await axios.post(this.slackWebhookUrl, {
        channel: '#microservices-notifications',
        icon_emoji: emoji,
        text: text,
        username: 'Reports Microservice',
        attachments: [
          {
            color: color,
            title: title,
            text: info,
            fields: [
              {
                title: 'Priority',
                value: priority,
                short: false,
              },
              {
                title: 'Environment',
                value: env.IS_PRODUCTION ? 'Production' : 'Development',
                short: true,
              },
              {
                title: 'Timestamp',
                value: new Date().toISOString(),
                short: true,
              },
            ],
            footer: 'Reports Microservice',
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      });

      console.log('Notification sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
