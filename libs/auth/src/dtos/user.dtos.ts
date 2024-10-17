import { IdentityEnum } from '@app/database';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum } from 'class-validator';
import { normalizeEmail } from 'libs/shared/functions/shared.functions';

@Injectable()
export class EmailDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email!: string;
}

@Injectable()
export class UserRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ enum: IdentityEnum })
  @IsEnum(IdentityEnum)
  identity: IdentityEnum;

  @ApiProperty()
  @IsString()
  postcode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}

@Injectable()
export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email!: string;

  //@ApiProperty()
  //@IsNotEmpty()
  //@IsString()
  //password!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code!: string;
}
