import {
    CreateTemplateCommand,
    CreateTemplateRequest,
    SendEmailCommand,
    SendEmailRequest,
    SendTemplatedEmailCommand,
    SendTemplatedEmailRequest,
    SESClient,
    UpdateTemplateCommand,
    UpdateTemplateRequest,
} from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from 'libs/shared/exceptions/api.exception';

@Injectable()
export class AwsSesService {
  private readonly logger = new Logger(AwsSesService.name);
  private readonly region: string;
  private readonly sesClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION');
    this.sesClient = new SESClient({ region: this.region });
  }

  public async sendEmail(
    sender: string,
    receipient: string,
    subject: string,
    textBody: string,
  ) {
    const input: SendEmailRequest = {
      Source: sender,
      Destination: {
        ToAddresses: [receipient],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: textBody,
          },
        },
      },
    };

    const command = new SendEmailCommand(input);
    const response = await this.sesClient.send(command);

    return response;
  }

  public async createTemplate(template: CreateTemplateRequest) {
    try {
      const command = new CreateTemplateCommand(template);
      const response = await this.sesClient.send(command);
      return response;
    } catch (e) {
      this.logger.error('createTemplate = ' + e);
      throw new ApiException('Failed to create template', e);
    }
  }

  public async updateTemplate(template: UpdateTemplateRequest) {
    try {
      const command = new UpdateTemplateCommand(template);
      const response = await this.sesClient.send(command);
      return response;
    } catch (e) {
      this.logger.error('updateTemplate = ' + e);
      throw new ApiException('Failed to update template', e);
    }
  }

  public async sendTemplatedEmail(
    sender: string,
    receipient: string,
    templateName: string,
    templateData: any,
  ) {
    try {
      const input: SendTemplatedEmailRequest = {
        Source: sender,
        Destination: {
          ToAddresses: [receipient],
        },
        Template: templateName,
        TemplateData: JSON.stringify(templateData),
      };
      const command = new SendTemplatedEmailCommand(input);
      const response = await this.sesClient.send(command);
      return response;
    } catch (e) {
      this.logger.error('sendTemplatedEmail = ' + e);
      throw new ApiException('Failed to send email template', e);
    }
  }
}
