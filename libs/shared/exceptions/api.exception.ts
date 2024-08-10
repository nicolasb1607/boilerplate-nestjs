import { DatabaseException } from '@app/database';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { AxiosException } from 'libs/shared/exceptions/axios.exception';

export class ApiException {
  constructor(
    message: string,
    errorObject: any,
    status?: HttpStatus,
    byPass?: boolean,
  ) {
    if (!status) status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (byPass) throw new HttpException(message, status);

    //DATABASE
    if (errorObject instanceof DatabaseException) throw errorObject;
    //AXIOS
    else if (errorObject instanceof AxiosError)
      throw new AxiosException(message, errorObject);
    //DEFAULT
    else throw new HttpException(message, status);
  }
}
