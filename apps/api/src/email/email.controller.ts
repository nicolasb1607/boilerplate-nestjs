import { Role, Roles } from '@app/auth';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateTemplateDto } from 'apps/api/src/email/dto/createTemplate.dto';
import { EmailService } from 'apps/api/src/email/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Roles(Role.Admin)
  @Post('createTemplate')
  async createTemplate(@Body() dto: CreateTemplateDto) {
    return await this.emailService.createTemplate(dto);
  }

  @Roles(Role.Admin)
  @Post('updateTemplate')
  async updateTemplate(@Body() dto: CreateTemplateDto) {
    return await this.emailService.updateTemplate(dto);
  }
}
