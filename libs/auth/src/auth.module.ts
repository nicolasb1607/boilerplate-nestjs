import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { DatabaseModule, UserEntity } from '@app/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), DatabaseModule],
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
export class AuthModule { }
