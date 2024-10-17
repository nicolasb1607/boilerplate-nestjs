import { Role } from '@app/auth/enums/role.enum';
import { UserEntity } from '@app/database';
import { RawBodyRequest } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class JwtToken {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export interface UserRequest extends RawBodyRequest<Request> {
  user: UserEntity;
}
