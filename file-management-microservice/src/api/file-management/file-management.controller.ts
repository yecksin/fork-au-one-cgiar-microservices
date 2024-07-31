import { Controller, Post, Body, Res, Delete } from '@nestjs/common';
import { FileManagementService } from './file-management.service';
import {
  FileValidationDto,
  UploadFileDto,
} from './dto/upload-file-managment.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseUtils } from '../../utils/response.utils';

@ApiTags('File Management')
@Controller()
export class FileManagementController {
  constructor(private readonly fileManagementService: FileManagementService) {}

  @ApiOperation({ summary: 'Upload a file to S3' })
  @ApiHeader({
    name: 'auth',
    description:
      'Basic authentication as a JSON string: {"username": "your_username", "password": "your_password"}',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'File successfully uploaded to S3.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bucket name, file name, and file are required.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('upload')
  async create(@Body() createFileManagmentDto: UploadFileDto) {
    return await this.fileManagementService.uploadFile(createFileManagmentDto);
  }

  @ApiOperation({ summary: 'Validate and retrieve a file from S3' })
  @ApiHeader({
    name: 'auth',
    description:
      'Basic authentication as a JSON string: {"username": "your_username", "password": "your_password"}',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'File successfully validated and retrieved as a stream.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bucket name and key are required.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('validation')
  async validateFile(
    @Body() fileValidationDto: FileValidationDto,
    @Res() res: Response,
  ): Promise<ResponseUtils> {
    return await this.fileManagementService.fileValidation(fileValidationDto);
    
  }

  @ApiOperation({ summary: 'Delete a file from S3' })
  @ApiHeader({
    name: 'auth',
    description:
      'Basic authentication as a JSON string: {"username": "your_username", "password": "your_password"}',
    required: true,
  })
  @Delete('delete')
  async deleteFile(@Body() fileValidationDto: FileValidationDto) {
    return await this.fileManagementService.deleteFile(fileValidationDto);
  }
}
