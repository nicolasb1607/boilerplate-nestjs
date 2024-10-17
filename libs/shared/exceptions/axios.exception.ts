import { HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

export class AxiosException extends HttpException {
  constructor(customMessage, errorObject: AxiosError) {
    const HttpResponse = {
      customMessage,
      message: errorObject.message,
      status: errorObject.response?.status,
      request: {
        method: errorObject.request?.method,
        url: errorObject.request?.url,
      },
      response: {
        status: errorObject.response?.status,
        statusText: errorObject.response?.statusText,
      },
    };
    super(HttpResponse, HttpResponse.status);
  }
}
