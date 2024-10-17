import {
  NotFoundError,
  OptimisticLockError,
  UniqueConstraintViolationException,
  ValidationError,
} from '@mikro-orm/core';
import { HttpException, HttpStatus } from '@nestjs/common';

export class MikroOrmException extends HttpException {
  constructor(errorObject: ValidationError) {
    const defaultErrorMessage = 'An error occurred';
    switch (true) {
      case errorObject instanceof NotFoundError: {
        super(
          { message: errorObject.message || 'Entity not found' },
          HttpStatus.NOT_FOUND,
        );
        break;
      }
      case errorObject instanceof UniqueConstraintViolationException: {
        super(
          { message: errorObject.message || 'Unique constraint violation' },
          HttpStatus.CONFLICT,
        );
        break;
      }
      case errorObject instanceof OptimisticLockError: {
        super(
          { message: errorObject.message || 'Optimistic lock error' },
          HttpStatus.CONFLICT,
        );
        break;
      }
      // Add more cases for other specific errors if needed
      default: {
        super(
          { message: errorObject.message || defaultErrorMessage },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
