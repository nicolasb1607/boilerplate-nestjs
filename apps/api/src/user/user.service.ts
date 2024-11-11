import { AwsS3Service } from '@app/aws-s3';
import { IdentityEnum, UserEntity } from '@app/database';
import { UserRepository } from '@app/database/repositories/user.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from 'apps/api/src/user/dtos/updateUser.dto';
import { instanceToPlain } from 'class-transformer';
import { ApiException } from 'libs/shared/exceptions/api.exception';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        public readonly userRepository: UserRepository,
        private readonly awsS3Service: AwsS3Service,
    ) {}

    public async uploadProfileImage(
        user: UserEntity,
        file: Express.Multer.File,
    ): Promise<string> {
        if (user.profilePictureUrl) {
            await this.awsS3Service.deleteImage(user.profilePictureUrl);
        }
        const url = await this.awsS3Service.uploadImage(file);
        user.profilePictureUrl = url;
        this.userRepository.persistAndFlush(user);
        return url;
    }

    public async getUserById(id: string): Promise<UserEntity> {
        try {
            const populate = [];

            return await this.userRepository.findOneOrFail(id, {
                populate,
            });
        } catch (e) {
            this.logger.error('getUserById = ' + e);
            throw new ApiException('Failed to get user by Id', e);
        }
    }

    async updateUserProfile(
        user: UserEntity,
        dto: UpdateUserDto,
    ): Promise<UserEntity> {
        try {
            return await this.userRepository.update(
                { id: user.id },
                {
                    ...instanceToPlain(dto),
                },
            );
        } catch (e) {
            this.logger.error('updateUserProfile = ' + e);
            throw new ApiException('Failed to update user profile', e);
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            return await this.userRepository.delete({ id: userId });
        } catch (e) {
            this.logger.error('deleteUser = ' + e);
            throw new ApiException('Failed to delete user', e);
        }
    }

    /*
     * Private Methods
     */

    private _convertGenderToIdentityType(gender: string): IdentityEnum {
        switch (gender) {
            case 'M':
                return IdentityEnum.Male;
            case 'F':
                return IdentityEnum.Female;
            default:
                return IdentityEnum.PreferNotToSay;
        }
    }
}
