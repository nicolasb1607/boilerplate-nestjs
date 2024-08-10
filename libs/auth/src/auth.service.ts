import { UserLoginDto, UserRegistrationDto } from '@app/auth/dtos/user.dtos';
import { JwtPayload, JwtToken } from '@app/auth/types/jwt.type';
import { UserEntity, UserRepository } from '@app/database';
import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ApiException } from 'libs/shared/exceptions/api.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly secret: string;
  private readonly accessTokenExpirationTime: string;
  private readonly refreshTokenExpirationTime: string;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET');
    this.accessTokenExpirationTime = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION_TIME',
    );
    this.refreshTokenExpirationTime = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    );
  }

  public async register(data: UserRegistrationDto): Promise<JwtToken> {
    const user = await this.userRepository.save({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });
    return this._generateJwtToken(user);
  }

  public async verify(accessToken: string): Promise<UserEntity> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        accessToken,
        { secret: this.secret },
      );

      const user = await this.userRepository.findOneOrFail({ id: payload.id });
      user.verified = true;
      await this.userRepository.persistAndFlush(user);
      return user;
    } catch (e) {
      this.logger.error('verify = ' + e);
      throw new ApiException("Unable to verify user'email", e);
    }
  }

  public async login(dto: UserLoginDto): Promise<JwtToken> {
    try {
      const user = await this.userRepository.findOneOrFail({
        email: dto.email,
      });
      if (!user.password) throw new NotFoundException('User not found');
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (isMatch) {
        return this._generateJwtToken(user);
      }
      throw new NotFoundException('User not found');
    } catch (e) {
      this.logger.warn('login = ' + e);
      throw new ApiException('User not found', e, HttpStatus.NOT_FOUND);
    }
  }

  /*
    Private Methods
  */
  private async _generateJwtToken(user: UserEntity): Promise<JwtToken> {
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
    return { accessToken, refreshToken };
  }
}
