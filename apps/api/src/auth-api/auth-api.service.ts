import {
  AuthService,
  JwtToken,
  UserLoginDto,
  UserRegistrationDto,
} from '@app/auth';
import { UserEntity, UserRepository } from '@app/database';
import { Injectable, Logger } from '@nestjs/common';
import { SENDER_EMAIL } from 'apps/api/src/email/constants/email.contants';
import { EmailService } from 'apps/api/src/email/email.service';
import { ApiException } from 'libs/shared/exceptions/api.exception';

@Injectable()
export class AuthApiService {
  private readonly logger = new Logger(AuthApiService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) { }

  public async register(dto: UserRegistrationDto): Promise<void> {
    try {
      const tokens = await this.authService.register({
        ...dto,
        email: dto.email,
      });

      await this.emailService.sendVerificationEmail({
        sender: SENDER_EMAIL,
        receipient: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
        },
        jwtToken: tokens.accessToken,
      });
    } catch (e) {
      this.logger.error('register = ' + e);
      throw new ApiException('Failed to register user', e);
    }
  }

  public async verify(token: string) {
    try {
      const user = await this.authService.verify(token);

      await this.emailService.sendHelloTemplatedEmail({
        sender: SENDER_EMAIL,
        receipient: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
      return user;
    } catch (e) {
      this.logger.error('verify = ' + e);
      throw new ApiException("Failed to verify user's email", e);
    }
  }

  public async login(dto: UserLoginDto): Promise<JwtToken | UserEntity> {
    try {
      const jwt = await this.authService.login(dto);

      const user = await this.userRepository.findOneOrFail({
        email: dto.email,
      });
      if (!user.verified) {
        await this.emailService.sendVerificationEmail({
          sender: SENDER_EMAIL,
          receipient: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          jwtToken: jwt.accessToken,
        });
        return user;
      }
      return jwt;
    } catch (e) {
      this.logger.error('login = ' + e);
      throw new ApiException('Failed to login', e);
    }
  }

  /*
    Private Methods
  */
}
