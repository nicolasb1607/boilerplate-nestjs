import { JwtPayload } from '@app/auth/types/jwt.type';
import { UserEntity, UserRepository } from '@app/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JwtStrategy') {
        constructor(
                private readonly configService: ConfigService,
                private readonly userRepository: UserRepository,
        ) {
                super({
                        jwtFromRequest:
                                ExtractJwt.fromAuthHeaderAsBearerToken(),
                        ignoreExpiration: false,
                        secretOrKey: configService.get<string>('JWT_SECRET'),
                });
        }

        async validate(payload: JwtPayload): Promise<UserEntity> {
                try {
                        const user = await this.userRepository.findOneOrFail(
                                payload.id,
                        );
                        return user;
                } catch (e) {
                        throw new UnauthorizedException();
                }
        }
}
