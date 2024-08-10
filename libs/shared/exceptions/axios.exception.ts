import { HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

export class AxiosException extends HttpException {
  constructor(customeMessage, errorObject: AxiosError) {
    const HttpResponse = {
      customeMessage,
      message: errorObject.message,
      status: errorObject.response.status,
      request: errorObject.request,
      response: errorObject.response,
    };
    super(HttpResponse, HttpResponse.status);
  }
}
