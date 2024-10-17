import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleConnectionDto {
  @ApiProperty()
  @IsString()
  code: string;
}
