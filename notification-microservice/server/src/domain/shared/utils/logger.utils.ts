import { Logger } from '@nestjs/common';
import {
  ResClarisaValidateConectioDto,
  ResMisConfigDto,
} from '../../tools/clarisa/dtos/clarisa-create-conection.dto';
import { ConfigMessageDto } from '../global-dto/mailer.dto';

export const emailStatus = (
  logger: Logger,
  from: ResClarisaValidateConectioDto,
  dataEmail: ConfigMessageDto,
  error?: any,
) => {
  const baseMessage = `[${getDate()}] (${from.client_id}) ${from.sender_mis.acronym} - ${from.sender_mis.environment}:`;
  if (!error) {
    logger.verbose(
      `${baseMessage} Was sent correctly. "${dataEmail.emailBody.subject}"`,
    );
  } else {
    logger.error(
      `${baseMessage} An error occurred while sending. "${dataEmail.emailBody.subject}"`,
    );
    logger.error(error);
  }
};

const getDate = (): string => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
  const dateTimeString = `${formattedDate} ${formattedTime}`;
  return dateTimeString;
};
