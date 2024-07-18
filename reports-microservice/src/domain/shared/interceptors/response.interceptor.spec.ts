import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, of, throwError } from 'rxjs';
import { ServiceResponseDto } from '../global-dto/service-response.dto';
import { ENV } from '../../utils/env.utils';
import { ServerResponseDto } from '../global-dto/server-response.dto';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let callHandler: CallHandler;
  let context: ExecutionContext;
  let responseMock: any;
  let requestMock: any;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
    callHandler = {
      handle: jest.fn(),
    };
    responseMock = {
      status: jest.fn(),
    };
    requestMock = {
      url: '/test',
      method: 'GET',
      socket: { remoteAddress: '127.0.0.1' },
    };
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
        getRequest: jest.fn().mockReturnValue(requestMock),
      }),
    } as unknown as ExecutionContext;
  });

  it('should return modified response for ServiceResponseDto', async () => {
    const responseDto: ServiceResponseDto<unknown> = {
      data: { key: 'value' },
      status: HttpStatus.OK,
      description: 'Test description',
      errors: null,
    };
    (callHandler.handle as jest.Mock).mockReturnValue(of(responseDto));

    const result = await interceptor
      .intercept(context, callHandler)
      .toPromise();

    expect(result).toEqual({
      ...responseDto,
      timestamp: expect.any(String),
      path: '/test',
    });
    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should return modified response for error', async () => {
    const error = new InternalServerErrorException('Test error');
    (callHandler.handle as jest.Mock).mockReturnValue(throwError(() => error));

    await expect(
      interceptor.intercept(context, callHandler).toPromise(),
    ).rejects.toThrow('Test error');
  });

  it('should return modified response for unknown response', async () => {
    const unknownResponse = { some: 'data' };
    (callHandler.handle as jest.Mock).mockReturnValue(of(unknownResponse));

    const result = await interceptor
      .intercept(context, callHandler)
      .toPromise();

    expect(result).toEqual({
      data: [],
      status: HttpStatus.OK,
      description: 'Unknown message',
      errors: null,
      timestamp: expect.any(String),
      path: '/test',
    });
    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
  });
});
