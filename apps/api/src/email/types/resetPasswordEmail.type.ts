import { ApiProperty } from '@nestjs/swagger';
import { UserInfos } from 'apps/api/src/email/types/helloTemplatedEmail.type';

export class ResetPasswordTemplatedEmail {
  @ApiProperty()
  sender: string;

  @ApiProperty()
  recipient: UserInfos;

  @ApiProperty()
  token: string;
}
