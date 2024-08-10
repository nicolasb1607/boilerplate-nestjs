import { Module } from '@nestjs/common';
import { AuthApiController } from './auth-api.controller';
import { AuthApiService } from './auth-api.service';
import { AuthModule } from '@app/auth';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailModule } from 'apps/api/src/email/email.module';
import { UserEntity } from '@app/database';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), AuthModule, EmailModule],
  controllers: [AuthApiController],
  providers: [AuthApiService],
})
export class AuthApiModule { }
