import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { env } from 'process';
import { ResponseUtils } from '../../utils/response.utils';
import {
  UploadFileDto,
  FileValidationDto,
} from './dto/upload-file-managment.dto';
import { Readable } from 'stream';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FileManagementService {
  private readonly interval: number = 3000;
  private readonly maxAttempts: number = 6;

  private readonly _logger = new Logger(FileManagementService.name);
  private s3Client: S3Client;

  constructor(private readonly _notificationsService: NotificationsService) {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(uploadFileDto: UploadFileDto): Promise<ResponseUtils> {
    try {
      const { fileName, bucketName, file } = uploadFileDto;

      const key: string = fileName;
      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: file,
      };
      const s3Upload = await this.s3Client.send(
        new PutObjectCommand(uploadParams),
      );

      return ResponseUtils.format({
        data: s3Upload,
        description: 'File uploaded successfully',
        status: HttpStatus.CREATED,
      });
    } catch (error) {
      this._logger.error(`Error generating pdf: ${error}`);
    }
  }

  async fileValidation(
    fileValidationDto: FileValidationDto,
  ): Promise<ResponseUtils> {
    const { bucketName, key } = fileValidationDto;
    if (!bucketName || !key) {
      this._logger.error('Bucket name and key are required');
      return ResponseUtils.format({
        data: null,
        description: 'Bucket name and key are required',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const input = {
      Bucket: bucketName,
      Key: key,
    };

    for (let attempts = 0; attempts < this.maxAttempts; attempts++) {
      try {
        const command = new GetObjectCommand(input);
        const { Body } = await this.s3Client.send(command);

        if (!Body) this._logger.error(`File not found: ${key}`);

        if (Body instanceof Readable) {
          const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
          this._logger.log(`File found: streaming the file ${key}`);
          return ResponseUtils.format({
            data: fileUrl,
            description: 'File successfully validated and retrieved as url',
            status: HttpStatus.CREATED,
          });
        }
      } catch (error) {
        this._logger.warn(
          `Attempt ${attempts + 1} - The PDF was not generated and uploaded: ${error.message}`,
        );
        if (attempts < this.maxAttempts - 1) {
          await this.delay(this.interval);
        }
      }
    }
    this._logger.error('Max attempts reached. PDF generation failed.');
    await this._notificationsService.sendSlackNotification(
      ':report:',
      'File Management Microservice',
      '#FF0000',
      'Error to retrieve PDF',
      'Max attempts reached. PDF generation failed',
      'High',
    );
    return ResponseUtils.format({
      data: null,
      description: 'Max attempts reached. PDF generation failed',
      errors: 'Max attempts reached. PDF generation failed',
      status: HttpStatus.CREATED,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async deleteFile(fileValidationDto: FileValidationDto): Promise<void> {
    const { bucketName, key } = fileValidationDto;

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    this._logger.debug(`File ${key} deleted from bucket ${bucketName}`);
  }
}
