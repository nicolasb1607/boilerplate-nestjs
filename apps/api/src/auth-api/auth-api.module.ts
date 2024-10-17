import { Module } from '@nestjs/common';
import { AuthApiController } from './auth-api.controller';
import { AuthApiService } from './auth-api.service';
import { MembersApiModule } from 'apps/api/src/members-api/members-api.module';
import { AuthModule } from '@app/auth';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConstituencyEntity } from '@app/database/entities/constituency.entity';
import { EmailModule } from 'apps/api/src/email/email.module';
import { UserEntity } from '@app/database';
import { InteractionEntity } from '@app/database/entities/interaction.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      UserEntity,
      ConstituencyEntity,
      InteractionEntity,
    ]),
    MembersApiModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [AuthApiController],
  providers: [AuthApiService],
})
export class AuthApiModule { }
