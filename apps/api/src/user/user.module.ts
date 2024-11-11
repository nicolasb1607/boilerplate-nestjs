import { AwsS3Module } from '@app/aws-s3';
import { UserEntity } from '@app/database/entities/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [MikroOrmModule.forFeature([UserEntity]), AwsS3Module],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
