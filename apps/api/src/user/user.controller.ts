import { Role, Roles, UserRequest } from '@app/auth';
import { UserEntity } from '@app/database/entities/user.entity';
import {
	Body,
	Controller,
	Delete,
	Get,
	ParseUUIDPipe,
	Post,
	Put,
	Query,
	Request,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiExcludeEndpoint,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from 'apps/api/src/user/dtos/updateUser.dto';
import { UserService } from 'apps/api/src/user/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userServices: UserService) {}

    @Roles(Role.User)
    @Post('upload-profile-image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfileImage(
        @Request() req: UserRequest,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ imageUrl: string }> {
        const imageUrl = await this.userServices.uploadProfileImage(
            req.user,
            file,
        );
        return { imageUrl };
    }

    @Roles(Role.User)
    @Get('profile')
    @ApiBearerAuth()
    @ApiResponse({ type: UserEntity })
    async getProfile(@Request() req: UserRequest): Promise<UserEntity> {
        return await this.userServices.getUserById(req.user.id);
    }

    @Roles(Role.User)
    @Put('profile')
    @ApiBearerAuth()
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ type: UserEntity })
    async updateUserProfile(
        @Request() req: UserRequest,
        @Body() dto: UpdateUserDto,
    ): Promise<UserEntity> {
        return await this.userServices.updateUserProfile(req.user, dto);
    }

    @Roles(Role.User)
    @Delete()
    @ApiBearerAuth()
    async deleteUser(@Request() req: UserRequest): Promise<void> {
        return await this.userServices.deleteUser(req.user.id);
    }

    /*****************************************************************************
     * ADMIN ROUTES
     ****************************************************************************/

    @Roles(Role.Admin)
    @Get()
    @ApiExcludeEndpoint()
    async getUserById(
        @Query('id', ParseUUIDPipe) id: string,
    ): Promise<UserEntity> {
        return await this.userServices.getUserById(id);
    }
}
