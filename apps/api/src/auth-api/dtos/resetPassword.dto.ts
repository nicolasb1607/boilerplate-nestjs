import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class SendResetPasswordLinkDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
}

@Injectable()
export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;
}
