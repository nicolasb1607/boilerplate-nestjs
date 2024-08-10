import { AwsSesService } from '@app/aws-ses';
import { CreateTemplateRequest } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { VERIFICATION_URL } from 'apps/api/src/email/constants/email.contants';
import { CreateTemplateDto } from 'apps/api/src/email/dto/createTemplate.dto';
import { HelloTemplateName } from 'apps/api/src/email/templates/hello.template';
import { VerifyTemplateName } from 'apps/api/src/email/templates/verify.template';
import { HelloTemplatedEmail } from 'apps/api/src/email/types/helloTemplatedEmail.type';
import { VerificationEmail } from 'apps/api/src/email/types/verificationEmail.type';
import { ApiException } from 'libs/shared/exceptions/api.exception';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly awsSesService: AwsSesService) { }

  public async createTemplate(dto: CreateTemplateDto) {
    try {
      const template: CreateTemplateRequest = {
        Template: {
          TemplateName: dto.templateName,
          SubjectPart: dto.templateSubject,
          HtmlPart: dto.templateHTMLBody,
        },
      };
      return await this.awsSesService.createTemplate(template);
    } catch (e) {
      this.logger.error('createTemplate = ' + e);
      throw new ApiException('Failed to create template', e);
    }
  }

  public async updateTemplate(dto: CreateTemplateDto) {
    try {
      const template: CreateTemplateRequest = {
        Template: {
          TemplateName: dto.templateName,
          SubjectPart: dto.templateSubject,
          HtmlPart: dto.templateHTMLBody,
        },
      };
      return await this.awsSesService.updateTemplate(template);
    } catch (e) {
      this.logger.error('updateTemplate = ' + e);
      throw new ApiException('Failed to update template', e);
    }
  }

  public async sendVerificationEmail(data: VerificationEmail) {
    try {
      return await this.awsSesService.sendTemplatedEmail(
        data.sender,
        data.receipient.email,
        VerifyTemplateName,
        {
          firstName: data.receipient.firstName,
          lastName: data.receipient.lastName,
          verificationLink: `${VERIFICATION_URL}?token=${data.jwtToken}`,
        },
      );
    } catch (e) {
      this.logger.error('sendVerificationEmail = ' + e);
      throw new ApiException('Failed to send verfication email', e);
    }
  }

  public async sendHelloTemplatedEmail(data: HelloTemplatedEmail) {
    try {
      return await this.awsSesService.sendTemplatedEmail(
        data.sender,
        data.receipient.email,
        HelloTemplateName,
        {
          firstName: data.receipient.firstName,
          lastName: data.receipient.lastName,
        },
      );
    } catch (e) {
      this.logger.error('sendHelloTemplatedEmail = ' + e);
      throw new ApiException('Failed to send email', e);
    }
  }
}
