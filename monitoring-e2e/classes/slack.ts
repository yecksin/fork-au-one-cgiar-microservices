import axios from 'axios';
import * as dotenv from 'dotenv';
import logger from './logs';
import { requestMessages } from './messages';
dotenv.config();

export const sendSlackNotification = async (
  obj: 'SCRAPINGERROR' | 'TEMPLATE' | 'SCRAPPINGSUCCESS' | 'SCRAPPINGWARNING'
) => {
  try {
    const { emoji, text, color, title, info, priority } = requestMessages[obj];
    await axios.post(process.env.SLACK_WEBHOOK_URL ?? '', {
      channel: process.env.SLACK_CHANEL,
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
              short: false
            },
            {
              title: 'Environment',
              value: process.env.IS_PRODUCTION ? 'Production' : 'Development',
              short: true
            },
            {
              title: 'Timestamp',
              value: new Date().toISOString(),
              short: true
            }
          ],
          footer: 'Reports Microservice',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    });
  } catch (error) {
    logger.error(`Error sending slack notification: ${error}`);
  }
};

export class ConfigSlackMessageDto {
  public emoji: string;
  public text: string;
  public color: string;
  public title: string;
  public info: string;
  public priority: string;

  constructor() {
    this.emoji = '';
    this.text = '';
    this.color = '';
    this.title = '';
    this.info = '';
    this.priority = '';
  }
}
