import { DatabaseException } from '@app/database';
import { ValidationError } from '@mikro-orm/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { AxiosException } from 'libs/shared/exceptions/axios.exception';
import { MikroOrmException } from 'libs/shared/exceptions/mikroOrm.exceptions';

export class ApiException {
    constructor(
        message: string,
        errorObject: any,
        status?: HttpStatus,
        byPass = false,
    ) {
        if (byPass === true) {
            throw new HttpException(
                message,
                status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        //DATABASE
        else if (errorObject instanceof DatabaseException) throw errorObject;
        //AXIOS
        else if (errorObject instanceof AxiosError)
            throw new AxiosException(message, errorObject);
        else if (errorObject instanceof ValidationError) {
            throw new MikroOrmException(errorObject);
        }
        //DEFAULT
        else if (errorObject instanceof HttpException) throw errorObject;
        throw new HttpException(
            message,
            status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
