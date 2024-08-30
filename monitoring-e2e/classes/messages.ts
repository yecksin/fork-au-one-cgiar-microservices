export enum StatusColorEnum {
  ERROR = '#FF0000',
  SUCCESS = '#00FF00',
  WARNING = '#FFFF00'
}

export const requestMessages: Message = {
  TEMPLATE: {
    emoji: ':warning:',
    text: 'This is a test',
    color: StatusColorEnum.ERROR,
    title: 'Bi monitor test',
    info: 'info example',
    priority: 'high'
  },
  SCRAPINGERROR: {
    emoji: ':warning:',
    text: 'Monitor e2e Microservice - test',
    color: StatusColorEnum.ERROR,
    title: 'The content of the ??? report could not be loaded.',
    info: 'The content could not be rendered because the specified content was not found.',
    priority: 'high'
  },
  SCRAPPINGSUCCESS: {
    emoji: ':white_check_mark:',
    text: 'Monitor e2e Microservice - test',
    color: StatusColorEnum.SUCCESS,
    title: 'The content of the ??? report was loaded successfully.',
    info: 'The content was rendered successfully.',
    priority: 'low'
  },
  SCRAPPINGWARNING: {
    emoji: ':warning:',
    text: 'Monitor e2e Microservice - test',
    color: StatusColorEnum.WARNING,
    title: 'The content of the ??? report was loaded with warnings.',
    info: 'The content was rendered with warnings.',
    priority: 'medium'
  }
};

interface Message {
  SCRAPINGERROR: SlackNotification;
  TEMPLATE: SlackNotification;
  SCRAPPINGSUCCESS: SlackNotification;
  SCRAPPINGWARNING: SlackNotification;
}

interface SlackNotification {
  emoji: string;
  text: string;
  color: StatusColorEnum;
  title: string;
  info: string;
  priority: string;
}
