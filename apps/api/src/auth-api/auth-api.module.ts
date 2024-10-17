import { AuthModule } from '@app/auth';
import { UserEntity } from '@app/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EmailModule } from 'apps/api/src/email/email.module';
import { AuthApiController } from './auth-api.controller';
import { AuthApiService } from './auth-api.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), AuthModule, EmailModule],
  controllers: [AuthApiController],
  providers: [AuthApiService],
})
export class AuthApiModule {}
