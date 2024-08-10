import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@app/database/entities/user.entity';
import { AwsS3Module } from '@app/aws-s3';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), AwsS3Module],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule { }
