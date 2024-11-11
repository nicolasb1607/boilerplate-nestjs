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
import { normalizeEmail } from 'libs/shared/functions/shared.functions';

@Injectable()
export class AuthApiService {
        private readonly logger = new Logger(AuthApiService.name);

        constructor(
                private readonly userRepository: UserRepository,
                public readonly authService: AuthService,
                private readonly emailService: EmailService,
        ) {}

        /****************************************************************************
         * PASSWORD BASED AUTHENTICATION
         ****************************************************************************/
        //public async register(dto: UserRegistrationDto): Promise<void> {
        //  try {
        //    const { accessToken } = await this.authService.register({
        //      ...dto,
        //    });

        //    await this.emailService.sendVerificationEmail({
        //      sender: SENDER_EMAIL,
        //      recipient: {
        //        firstName: dto.firstName,
        //        lastName: dto.lastName,
        //        email: dto.email,
        //      },
        //      jwtToken: accessToken,
        //    });
        //  } catch (e) {
        //    this.logger.error('register = ' + e);
        //    throw new ApiException('Failed to register user', e);
        //  }
        //}

        //public async login(dto: UserLoginDto): Promise<JwtToken> {
        //  try {
        //    const jwt = await this.authService.login(dto);

        //    const user = await this.userRepository.findOneOrFail({
        //      email: dto.email,
        //    });
        //    if (!user.verified) {
        //      const { accessToken } =
        //        await this.authService.generateShortLivingToken(user);
        //      await this.emailService.sendVerificationEmail({
        //        sender: SENDER_EMAIL,
        //        recipient: {
        //          firstName: user.firstName,
        //          lastName: user.lastName,
        //          email: user.email,
        //        },
        //        jwtToken: accessToken,
        //      });
        //      throw new ApiException('User not verified', null, HttpStatus.FORBIDDEN);
        //    }
        //    return jwt;
        //  } catch (e) {
        //    this.logger.error('login = ' + e);
        //    throw new ApiException('Failed to login', e);
        //  }
        //}

        //public async verify(dto: VerifyUserDto): Promise<JwtToken> {
        //  try {
        //    const jwt = await this.authService.verify(dto.email, dto.code);

        //    const user = await this.userRepository.findOneOrFail({
        //      email: dto.email,
        //    });
        //    await this.interactionRepository.save({ user: user });

        //    await this.emailService.sendHelloTemplatedEmail({
        //      sender: SENDER_EMAIL,
        //      recipient: {
        //        firstName: user.firstName,
        //        lastName: user.lastName,
        //        email: user.email,
        //      },
        //    });
        //    return jwt;
        //  } catch (e) {
        //    this.logger.error('verify = ' + e);
        //    throw new ApiException("Failed to verify user's email", e);
        //  }
        //}

        //public async sendResetPasswordLink(
        //  dto: SendResetPasswordLinkDto,
        //): Promise<void> {
        //  try {
        //    const token = await this.authService.generateResetPasswordToken(
        //      dto.email,
        //    );
        //    const user = await this.userRepository.findOneOrFail({
        //      email: dto.email,
        //    });
        //    await this.emailService.sendResetPasswordTemplatedEmail({
        //      sender: SENDER_EMAIL,
        //      recipient: {
        //        firstName: user.firstName,
        //        lastName: user.lastName,
        //        email: user.email,
        //      },
        //      token: token.accessToken,
        //    });
        //  } catch (e) {
        //    this.logger.error('sendResetPasswordLink = ' + e);
        //    throw new ApiException('Failed to send Reset Password Link', e);
        //  }
        //}

        //public async resetPassword(
        //  user: UserEntity,
        //  dto: ResetPasswordDto,
        //): Promise<void> {
        //  try {
        //    return this.authService.resetPassword(user, dto.password);
        //  } catch (e) {
        //    this.logger.error('resetPassword = ' + e);
        //    throw new ApiException('Failed to reset password', e);
        //  }
        //}

        /*****************************************************************************
         * CODE BASED AUTHENTICATION
         ****************************************************************************/

        public async register(dto: UserRegistrationDto): Promise<void> {
                try {
                        const code = await this.authService.register({
                                ...dto,
                        });

                        await this.emailService.sendCodeVerificationEmail({
                                sender: SENDER_EMAIL,
                                recipient: {
                                        firstName: dto.firstName,
                                        lastName: dto.lastName,
                                        email: dto.email,
                                },
                                code: code,
                        });
                } catch (e) {
                        this.logger.error('register = ' + e);
                        throw new ApiException('Failed to register user', e);
                }
        }

        public async sendCode(email: string): Promise<void> {
                try {
                        const emailNormalized = normalizeEmail(email);
                        const user = await this.userRepository.findOneOrFail({
                                email: emailNormalized,
                        });
                        const code =
                                await this.authService.generateVerificationCode(
                                        emailNormalized,
                                );
                        await this.emailService.sendCodeVerificationEmail({
                                sender: SENDER_EMAIL,
                                recipient: {
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        email: user.email,
                                },
                                code: code,
                        });
                } catch (e) {
                        this.logger.error('sendCode = ' + e);
                        throw new ApiException(
                                'Failed to send verification code',
                                e,
                        );
                }
        }

        public async login(dto: UserLoginDto): Promise<JwtToken> {
                try {
                        const jwt = await this.authService.login(dto);
                        return jwt;
                } catch (e) {
                        this.logger.error('login = ' + e);
                        throw new ApiException('Failed to login', e);
                }
        }

        /*****************************************************************************
         * GOOGLE AUTHENTICATION
         ****************************************************************************/
        public async googleAuthRedirect(user: UserEntity): Promise<JwtToken> {
                try {
                        return await this.authService.generateJwtToken(user);
                } catch (e) {
                        this.logger.error('googleAuthRedirect = ' + e);
                        throw new ApiException(
                                'Failed to login with google',
                                e,
                        );
                }
        }
}
