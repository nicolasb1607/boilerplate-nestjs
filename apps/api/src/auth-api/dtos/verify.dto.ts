import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { normalizeEmail } from 'libs/shared/functions/shared.functions';

@Injectable()
export class VerifyUserDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code!: string;
}
