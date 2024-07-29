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

@Injectable()
export class FileManagementService {
  private readonly _logger = new Logger(FileManagementService.name);
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(uploadFileDto: UploadFileDto): Promise<any> {
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

      return s3Upload;
    } catch (error) {
      this._logger.error(`Error generating pdf: ${error}`);
    }
  }

  async fileValidation(fileValidationDto: FileValidationDto): Promise<any> {
    try {
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
      this._logger.error(`Error streaming the file: ${error}`);
      return ResponseUtils.format({
        data: null,
        description: 'File not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
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
