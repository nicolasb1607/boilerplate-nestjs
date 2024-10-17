import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { DatabaseModule, UserEntity } from '@app/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from 'libs/redis/src';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity]),
    DatabaseModule,
    RedisModule,
  ],
  providers: [
    //Services
    AuthService,
    JwtService,
    //Strategies
    JwtStrategy,
    //Guards Globally applied
    JwtAuthGuard,
    RolesGuard,
  ],
  controllers: [],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
