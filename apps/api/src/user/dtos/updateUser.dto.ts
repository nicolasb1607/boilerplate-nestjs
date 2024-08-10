import { IdentityEnum } from '@app/database';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

@Injectable()
export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty({ enum: IdentityEnum })
  @IsOptional()
  @IsEnum(IdentityEnum)
  identity?: IdentityEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postcode?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  address?: string;
}
