import { ApiProperty } from '@nestjs/swagger';
import { UserInfos } from 'apps/api/src/email/types/helloTemplatedEmail.type';

export class VerificationEmail {
  @ApiProperty()
  sender: string;

  @ApiProperty()
  receipient: UserInfos;

  @ApiProperty()
  jwtToken: string;
}
