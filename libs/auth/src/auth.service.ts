import { UserLoginDto, UserRegistrationDto } from '@app/auth/dtos/user.dtos';
import { Role } from '@app/auth/enums/role.enum';
import { JwtToken } from '@app/auth/types/jwt.type';
import { UserEntity, UserRepository } from '@app/database';
import { people_v1 } from '@googleapis/people';
import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { RedisService } from 'libs/redis/src';
import { ApiException } from 'libs/shared/exceptions/api.exception';
import { normalizeEmail } from 'libs/shared/functions/shared.functions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly secret: string;
  private readonly accessTokenExpirationTime: string;
  private readonly refreshTokenExpirationTime: string;
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET');
    this.accessTokenExpirationTime = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION_TIME',
    );
    this.refreshTokenExpirationTime = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    );
  }

  public async checkIfUserAlreadyExist(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({ email });
      if (user) return true;
      return false;
    } catch (e) {
      this.logger.error('checkIfUserAlreadyExist = ' + e);
      throw new ApiException('Failed to check if user exist', e);
    }
  }

  public async getUserFromAccessToken(
    accessToken: string,
  ): Promise<UserEntity> {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.secret,
      });
      const userId = payload.id;
      const user = await this.userRepository.findOneOrFail({ id: userId });

      return user;
    } catch (e) {
      this.logger.warn('getUserFromAccessToken = ' + e);
      return null; // Return null if the token is invalid or an error occurs
    }
  }

  public async refreshToken(user: UserEntity): Promise<JwtToken> {
    try {
      return this.generateJwtToken(user);
    } catch (e) {
      this.logger.error('refreshToken = ' + e);
      throw new ApiException(
        'Failed to refresh token',
        e,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /****************************************************************************
   * PASSWORD BASED AUTHENTICATION
   ****************************************************************************/

  //public async register(
  //  data: UserRegistrationDto,
  //): Promise<{ accessToken: string }> {
  //  const user = await this.userRepository.save({
  //    ...data,
  //    password: await bcrypt.hash(data.password, 10),
  //  });
  //  return this.generateShortLivingToken(user);
  //}

  //public async login(dto: UserLoginDto): Promise<JwtToken> {
  //  try {
  //    const user = await this.userRepository.findOneOrFail({
  //      email: dto.email,
  //    });
  //    if (!user.password) throw new NotFoundException('User not found');
  //    const isMatch = await bcrypt.compare(dto.password, user.password);
  //    if (isMatch) {
  //      return this._generateJwtToken(user);
  //    }
  //    throw new NotFoundException('User not found');
  //  } catch (e) {
  //    this.logger.warn('login = ' + e);
  //    throw new ApiException('User not found', e, HttpStatus.NOT_FOUND);
  //  }
  //}

  //public async verify(accessToken: string): Promise<UserEntity> {
  //  try {
  //    const payload: JwtPayload = await this.jwtService.verifyAsync(
  //      accessToken,
  //      { secret: this.secret },
  //    );

  //    const user = await this.userRepository.findOneOrFail({ id: payload.id });
  //    user.verified = true;
  //    await this.userRepository.persistAndFlush(user);
  //    return user;
  //  } catch (e) {
  //    this.logger.error('verify = ' + e);
  //    throw new ApiException("Unable to verify user'email", e);
  //  }
  //}

  //public async generateResetPasswordToken(
  //  email: string,
  //): Promise<{ accessToken: string }> {
  //  try {
  //    const user = await this.userRepository.findOneOrFail({ email });
  //    return this.generateShortLivingToken(user);
  //  } catch (e) {
  //    this.logger.warn('generateResetPasswordToken = ' + e);
  //    throw new ApiException('User not found', e, HttpStatus.NOT_FOUND);
  //  }
  //}

  //public async resetPassword(
  //  user: UserEntity,
  //  newPassword: string,
  //): Promise<void> {
  //  try {
  //    user.password = await bcrypt.hash(newPassword, 10);
  //    await this.userRepository.persistAndFlush(user);
  //  } catch (e) {
  //    this.logger.error('resetPassword = ' + e);
  //    throw new ApiException('Failed to reset password', e);
  //  }
  //}

  //public async generateShortLivingToken(
  //  user: UserEntity,
  //): Promise<{ accessToken: string }> {
  //  const payload = {
  //    id: user.id,
  //    firstName: user.firstName,
  //    lastName: user.lastName,
  //    roles: user.role,
  //  };
  //  const accessToken = await this.jwtService.signAsync(payload, {
  //    secret: this.secret,
  //    expiresIn: '15m',
  //  });
  //  return { accessToken };
  //}

  //private async _generateJwtToken(user: UserEntity): Promise<JwtToken> {
  //  const payload = {
  //    id: user.id,
  //    firstName: user.firstName,
  //    lastName: user.lastName,
  //    roles: user.role,
  //  };
  //  const accessToken = await this.jwtService.signAsync(payload, {
  //    secret: this.secret,
  //    expiresIn: this.accessTokenExpirationTime,
  //  });
  //  const refreshToken = await this.jwtService.signAsync(payload, {
  //    secret: this.secret,
  //    expiresIn: this.refreshTokenExpirationTime,
  //  });
  //  return { accessToken, refreshToken, expiresIn: 86400000 };
  //}

  /*****************************************************************************
   * CODE BASED AUTHENTICATION
   ****************************************************************************/
  public async register(data: UserRegistrationDto): Promise<string> {
    try {
      const user = await this.userRepository.save({
        ...data,
      });
      return await this.generateVerificationCode(user.email);
    } catch (e) {
      this.logger.error('register = ' + e);
      throw new ApiException(
        'Failed to register',
        e,
        HttpStatus.CONFLICT,
        false,
      );
    }
  }

  public async login(dto: UserLoginDto): Promise<JwtToken> {
    try {
      const user = await this.userRepository.findOneOrFail({
        email: dto.email,
      });
      const isMatch = await this._verifyCode(dto.email, dto.code);
      if (isMatch) {
        await this.redisService.publisher.del(user.email);
        return this.generateJwtToken(user);
      }
      throw new NotFoundException('Verification code not found');
    } catch (e) {
      this.logger.warn('login = ' + e);
      throw new ApiException('User not found', e, HttpStatus.NOT_FOUND);
    }
  }

  public async generateJwtToken(user: UserEntity): Promise<JwtToken> {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.secret,
      expiresIn: this.accessTokenExpirationTime,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.secret,
      expiresIn: this.refreshTokenExpirationTime,
    });
    return { accessToken, refreshToken, expiresIn: 86400000 };
  }

  public async generateVerificationCode(email: string): Promise<string | null> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this._saveVerificationCode(email, code);
    return code;
  }

  private async _saveVerificationCode(
    email: string,
    code: string,
  ): Promise<void> {
    await this.redisService.set(email, code, 15 * 60);
  }

  private async _verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = await this.redisService.get(email);
    return code === storedCode;
  }

  /*****************************************************************************
   * GOOGLE AUTHENTICATION
   ****************************************************************************/

  public async googleVerifyToken(code: string): Promise<JwtToken> {
    try {
      const resp = await this.googleClient.getToken(code);

      const ticket = await this.googleClient.verifyIdToken({
        idToken: resp.tokens.id_token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new ApiException(
          'Google Authentication failed',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { email, given_name, family_name, picture } = payload;
      this.googleClient.setCredentials({
        access_token: resp.tokens.access_token,
      });
      const peopleService = new people_v1.People({
        auth: this.googleClient,
      });

      const person = await peopleService.people.get({
        resourceName: 'people/me',
        personFields: 'birthdays',
      });

      const birthday = person.data.birthdays?.[0]?.date || null;
      const dateOfBirth = birthday
        ? new Date(birthday.year, birthday.month - 1, birthday.day)
        : null;

      const normalizedEmail = normalizeEmail(email);

      const user = await this.userRepository.findOrInsert(
        { email: normalizedEmail },
        {
          email: normalizedEmail,
          firstName: given_name,
          lastName: family_name || null,
          dateOfBirth,
          profilePictureUrl: picture || null,
          role: Role.User,
        },
      );

      const credentials = await this.generateJwtToken(user);
      return { ...credentials };
    } catch (e) {
      this.logger.error('googleVerifyToken = ' + e);
      throw new ApiException(
        'Google authentication or user registration failed',
        e,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
