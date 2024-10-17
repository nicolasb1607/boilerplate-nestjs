import { AwsSesService } from '@app/aws-ses';
import { CreateTemplateRequest } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import {
  RESET_PASSWORD_URL,
  VERIFICATION_URL,
} from 'apps/api/src/email/constants/email.contants';
import { CreateTemplateDto } from 'apps/api/src/email/dto/createTemplate.dto';
import { CodeVerifyTemplateName } from 'apps/api/src/email/templates/codeVerification.template';
import { HelloTemplateName } from 'apps/api/src/email/templates/hello.template';
import { ResetPasswordTemplateName } from 'apps/api/src/email/templates/resetPassword.template';
import { VerifyTemplateName } from 'apps/api/src/email/templates/verify.template';
import { HelloTemplatedEmail } from 'apps/api/src/email/types/helloTemplatedEmail.type';
import { ResetPasswordTemplatedEmail } from 'apps/api/src/email/types/resetPasswordEmail.type';
import {
  CodeVerificationEmail,
  VerificationEmail,
} from 'apps/api/src/email/types/verificationEmail.type';
import { ApiException } from 'libs/shared/exceptions/api.exception';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly awsSesService: AwsSesService) {}

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

  public async sendHelloTemplatedEmail(data: HelloTemplatedEmail) {
    try {
      return await this.awsSesService.sendTemplatedEmail(
        data.sender,
        data.recipient.email,
        HelloTemplateName,
        {
          firstName: data.recipient.firstName,
          lastName: data.recipient.lastName,
        },
      );
    } catch (e) {
      this.logger.error('sendHelloTemplatedEmail = ' + e);
      throw new ApiException('Failed to send email', e);
    }
  }

  /****************************************************************************
   * PASSWORD BASED AUTHENTICATION
   ****************************************************************************/

  public async sendVerificationEmail(data: VerificationEmail) {
    try {
      return await this.awsSesService.sendTemplatedEmail(
        data.sender,
        data.recipient.email,
        VerifyTemplateName,
        {
          firstName: data.recipient.firstName,
          lastName: data.recipient.lastName,
          verificationLink: `${VERIFICATION_URL}?token=${data.jwtToken}`,
        },
      );
    } catch (e) {
      this.logger.error('sendVerificationEmail = ' + e);
      throw new ApiException('Failed to send verification email', e);
    }
  }

  public async sendResetPasswordTemplatedEmail(
    data: ResetPasswordTemplatedEmail,
  ) {
    try {
      return await this.awsSesService.sendTemplatedEmail(
        data.sender,
        data.recipient.email,
        ResetPasswordTemplateName,
        {
          firstName: data.recipient.firstName,
          lastName: data.recipient.lastName,
          resetLink: `${RESET_PASSWORD_URL}?token=${data.token}`,
        },
      );
    } catch (e) {
      this.logger.error('sendResetPasswordTemplatedEmail = ' + e);
      throw new ApiException('Failed to send reset password email', e);
    }
  }
  /*****************************************************************************
   * CODE BASED AUTHENTICATION
   ****************************************************************************/

  public async sendCodeVerificationEmail(data: CodeVerificationEmail) {
    try {
      return await this.awsSesService.sendTemplatedEmail(
        data.sender,
        data.recipient.email,
        CodeVerifyTemplateName,
        {
          firstName: data.recipient.firstName,
          lastName: data.recipient.lastName,
          verificationCode: data.code,
        },
      );
    } catch (e) {
      this.logger.error('sendVerificationEmail = ' + e);
      throw new ApiException('Failed to send verification email', e);
    }
  }
}
