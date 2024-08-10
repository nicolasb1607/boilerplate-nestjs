import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  templateName!: string;

  @IsNotEmpty()
  @IsString()
  templateSubject!: string;

  @IsNotEmpty()
  @IsString()
  templateHTMLBody!: string;
}
