import { ApiProperty } from '@nestjs/swagger';

export class UserInfos {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;
}

export class HelloTemplatedEmail {
  @ApiProperty()
  sender: string;

  @ApiProperty()
  receipient: UserInfos;
}
