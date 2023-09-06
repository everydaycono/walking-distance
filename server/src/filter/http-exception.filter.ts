import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RedirectException } from './redirect.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const status = exception.getStatus();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isDebug = request.query?.debug;

    const message = exception.message || 'Unexpected error happend'; // error message
    const error = exception.getResponse()['error'];

    // social-login exception redirect see other Moved Permanentl
    if (exception instanceof RedirectException) {
      return response.status(301).json({
        statusCode: 301,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        error,
        data: exception.userInfo
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error
    });
  }
}

// https://docs.nestjs.com/exception-filters
