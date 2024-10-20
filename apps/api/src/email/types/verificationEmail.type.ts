import { ApiProperty } from '@nestjs/swagger';
import { UserInfos } from 'apps/api/src/email/types/helloTemplatedEmail.type';

export class VerificationEmail {
  @ApiProperty()
  sender: string;

  @ApiProperty()
  recipient: UserInfos;

  @ApiProperty()
  jwtToken: string;
}

export class CodeVerificationEmail {
  @ApiProperty()
  sender: string;

  @ApiProperty()
  recipient: UserInfos;

  @ApiProperty()
  code: string;
}
