import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { UserModule } from './user/user.module';
import { AuthModule, JwtAuthGuard, RolesGuard } from '@app/auth';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { config } from 'libs/shared/configs/axios.config';
import { AuthApiModule } from './auth-api/auth-api.module';
import { OpenAiModule } from '@app/open-ai';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';
import { ApiController } from 'apps/api/src/api.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 30,
      },
    ]),
    HttpModule.register(config),
    DatabaseModule,
    AuthModule,
    AuthApiModule,
    UserModule,
    OpenAiModule,
    EmailModule,
  ],
  controllers: [ApiController],
  providers: [
    //Services
    //Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ApiModule { }
