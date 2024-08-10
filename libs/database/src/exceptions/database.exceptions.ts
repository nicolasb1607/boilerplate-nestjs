import {
  PostgreSqlErrorCode,
  Severity,
} from '@app/database/exceptions/enums/postgresql.exceptions.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getEnumKeyByValue } from 'libs/shared/functions/shared.functions';

export class PostgreSqlResponse {
  code: PostgreSqlErrorCode;
  length: number;
  name: string;
  severity: Severity;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}

export class DatabaseException extends HttpException {
  constructor(response: PostgreSqlResponse) {
    const HttpResponse = {
      code: response.code,
      name: getEnumKeyByValue(PostgreSqlErrorCode, response.code),
      detail: response.detail,
      severity: response.severity,
    };

    switch (response.code) {
      // Class 02 -- No Data (this is also a warning class per the SQL standard)
      case PostgreSqlErrorCode.NO_DATA: {
        super(HttpResponse, HttpStatus.NOT_FOUND);
        break;
      }

      // Class 23 -- Integrity Constraint Violation
      case PostgreSqlErrorCode.INTEGRITY_CONSTRAINT_VIOLATION: {
        super(HttpResponse, HttpStatus.CONFLICT);
        break;
      }
      case PostgreSqlErrorCode.RESTRICT_VIOLATION: {
        super(HttpResponse, HttpStatus.CONFLICT);
        break;
      }
      case PostgreSqlErrorCode.NOT_NULL_VIOLATION: {
        super(HttpResponse, HttpStatus.BAD_REQUEST);
        break;
      }
      case PostgreSqlErrorCode.FOREIGN_KEY_VIOLATION: {
        super(HttpResponse, HttpStatus.CONFLICT);
        break;
      }
      case PostgreSqlErrorCode.UNIQUE_VIOLATION: {
        super(HttpResponse, HttpStatus.CONFLICT);
        break;
      }
      case PostgreSqlErrorCode.CHECK_VIOLATION: {
        super(HttpResponse, HttpStatus.BAD_REQUEST);
        break;
      }
      case PostgreSqlErrorCode.EXCLUSION_VIOLATION: {
        super(HttpResponse, HttpStatus.CONFLICT);
        break;
      }

      // Class 42 -- Syntax Error or Access Rule Violation
      case PostgreSqlErrorCode.UNDEFINED_COLUMN: {
        super(HttpResponse, HttpStatus.NOT_FOUND);
        break;
      }
      case PostgreSqlErrorCode.UNDEFINED_TABLE: {
        super(HttpResponse, HttpStatus.NOT_FOUND);
        break;
      }
      default: {
        super(HttpResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        break;
      }
    }
  }
}
